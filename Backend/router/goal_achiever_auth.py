from fastapi import APIRouter, Depends, HTTPException, Response, Request
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from DB import mongodb
import random
import os
import hashlib
from email.message import EmailMessage
import aiosmtplib

router = APIRouter()

# ------------------ CONFIG ------------------
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USER = os.getenv("SMTP_USER") 
SMTP_PASS = os.getenv("SMTP_PASSWORD")  
FROM_EMAIL = f"YourApp <{SMTP_USER}>"

ENV = os.getenv("ENV", "development")
IS_PROD = ENV == "production"
secure = IS_PROD
samesite = "none" if IS_PROD else "lax"

# ------------------ SCHEMAS ------------------
class SignupUser(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    otp: str
    newPassword: str

class VerifyOTP(BaseModel):
    email: EmailStr
    otp: str

# ------------------ UTILITIES ------------------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def generate_otp() -> str:
    return str(random.randint(100000, 999999))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def send_email(to: str, subject: str, html: str):
    message = EmailMessage()
    message["From"] = FROM_EMAIL
    message["To"] = to
    message["Subject"] = subject
    message.set_content("This email requires HTML support.")
    message.add_alternative(html, subtype="html")

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        start_tls=True,
        username=SMTP_USER,
        password=SMTP_PASS,
    )

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")

    print("Access Token:", token)

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = await mongodb.db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# ------------------ AUTH ROUTES ------------------
@router.post("/projects/goal_achiever/signup")
async def signup(user: SignupUser):
    db = mongodb.db.users

    existing = await db.find_one({"email": user.email})

    otp = generate_otp()
    now = datetime.utcnow()

    # ✅ CASE 1: User exists but NOT verified → resend OTP
    if existing and not existing.get("otpVerified"):
        await db.update_one(
            {"email": user.email},
            {"$set": {"otp": otp, "otpCreated": now}}
        )

        await send_email(
            to=user.email,
            subject="Your OTP Code",
            html=f"""
                <p>Hello {existing['username']},</p>
                <p>Your new OTP code is: <strong>{otp}</strong></p>
                <p>This code expires soon.</p>
            """
        )

        return {
            "success": True,
            "message": "OTP resent. Please verify your account."
        }

    # ❌ CASE 2: User exists and already verified
    if existing and existing.get("otpVerified"):
        raise HTTPException(status_code=400, detail="User already exists")

    # ✅ CASE 3: New user signup
    doc = {
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "otpVerified": False,
        "otp": otp,
        "otpCreated": now,
        "createdAt": now
    }

    await db.insert_one(doc)

    await send_email(
        to=user.email,
        subject="Your OTP Code",
        html=f"""
            <p>Hello {user.username},</p>
            <p>Your OTP code is: <strong>{otp}</strong></p>
            <p>This code expires soon.</p>
        """
    )

    return {"success": True, "message": "OTP sent to email"}

@router.post("/projects/goal_achiever/verify-otp")
async def verify_otp(data: VerifyOTP):
    db = mongodb.db.users
    user = await db.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.get("otpVerified"):
        raise HTTPException(status_code=400, detail="User already verified")
    if user.get("otp") != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    await db.update_one({"email": data.email}, {"$set": {"otpVerified": True}, "$unset": {"otp": "", "otpCreated": ""}})
    return {"success": True, "message": "Account verified successfully"}

@router.post("/projects/goal_achiever/login")
async def login(user: LoginUser, response: Response):
    db = mongodb.db.users
    existing = await db.find_one({"email": user.email})

    if not existing:
        raise HTTPException(status_code=404, detail="User not found")

    if not existing.get("otpVerified"):
        raise HTTPException(status_code=403, detail="Account not verified")

    if not verify_password(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": existing["email"]})

    # ✅ SET COOKIE
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,     # ❗ prevents JS access
        secure=secure,      # True in production (HTTPS)
        samesite=samesite,
        max_age=60 * 60 * 60 * 100,   # 1 hour
        path="/"
    )

    return {
        "success": True,
        "user": {
            "id": str(existing["_id"]),
            "username": existing["username"],
            "email": existing["email"],
        }
    }

@router.post("/projects/goal_achiever/forgot-password")
async def forgot_password(data: ForgotPassword):
    db = mongodb.db.users

    # Check if user exists
    user = await db.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate reset OTP
    otp = generate_otp()

    # Save OTP and timestamp to user
    await db.update_one(
        {"email": data.email},
        {"$set": {"resetOtp": otp, "resetOtpCreated": datetime.utcnow()}}
    )

    # Send OTP via Resend
    try:
        await send_email(
            to=data.email,
            subject="Password Reset OTP",
            html=f"""
                <p>Hello {user['username']},</p>
                <p>Your password reset OTP is: <strong>{otp}</strong></p>
                <p>This OTP expires in 10 minutes.</p>
            """
        )

    except Exception as e:
        # Optional: remove OTP from DB if sending fails
        await db.update_one(
            {"email": data.email},
            {"$unset": {"resetOtp": "", "resetOtpCreated": ""}}
        )
        raise HTTPException(status_code=500, detail=f"Failed to send OTP email: {str(e)}")

    return {"success": True, "message": "Password reset OTP sent"}

@router.post("/projects/goal_achiever/reset-password")
async def reset_password(data: ResetPassword):
    db = mongodb.db.users
    user = await db.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.get("resetOtp") != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    await db.update_one({"email": data.email}, {"$set": {"password": hash_password(data.newPassword)}, "$unset": {"resetOtp": "", "resetOtpCreated": ""}})
    return {"success": True, "message": "Password reset successfully"}

@router.get("/projects/goal_achiever/me")
async def get_logged_in_user(current_user: dict = Depends(get_current_user)):
    return {"success": True, "user": {"id": str(current_user["_id"]), "username": current_user["username"], "email": current_user["email"], "otpVerified": current_user.get("otpVerified"), "createdAt": current_user.get("createdAt")}}

@router.post("/projects/goal_achiever/resend-otp")
async def resend_otp(email: str, purpose: str):
    db = mongodb.db.users
    user = await db.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()
    now = datetime.utcnow()

    if purpose == "signup":
        otp_field = "otp"
        otp_time_field = "otpCreated"
        subject = "Your Signup OTP"
        html_message = f"<p>Your signup OTP is <strong>{otp}</strong></p>"
    elif purpose == "forgot-password":
        otp_field = "resetOtp"
        otp_time_field = "resetOtpCreated"
        subject = "Password Reset OTP"
        html_message = f"<p>Your password reset OTP is <strong>{otp}</strong></p>"
    else:
        raise HTTPException(status_code=400, detail="Invalid purpose")

    last_sent = user.get(otp_time_field)
    if last_sent and now - last_sent < timedelta(seconds=60):
        raise HTTPException(status_code=429, detail="Please wait before resending OTP")

    await db.update_one(
        {"email": email},
        {"$set": {otp_field: otp, otp_time_field: now}}
    )

    await send_email(email, subject, html_message)

    return {"success": True, "message": "OTP resent successfully"}

@router.post("/projects/goal_achiever/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        samesite=samesite,
    )
    return {
        "success": True,
        "message": "Logged out successfully"
    }