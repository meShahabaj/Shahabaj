from fastapi import APIRouter, Request
import random

router = APIRouter()

@router.post("/projects/rock_paper_scissor/detect")
async def gesture_detection(request: Request):

    # Read JSON body
    body = await request.json()
    user_choice = body.get("data")

    if user_choice not in ["Rock", "Paper", "Scissor"]:
        return {"error": "Invalid choice"}

    # Computer random choice
    computer_choice = random.choice(["Rock", "Paper", "Scissor"])

    # Determine result
    if user_choice == computer_choice:
        result = "Draw"
    elif (
        (user_choice == "Rock" and computer_choice == "Scissor") or
        (user_choice == "Paper" and computer_choice == "Rock") or
        (user_choice == "Scissor" and computer_choice == "Paper")
    ):
        result = "You Won"
    else:
        result = "Computer Won"

    # Response
    return {
        "user": user_choice,
        "computer": computer_choice,
        "result": result
    }
