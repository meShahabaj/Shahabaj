from flask import Blueprint, request
import json
import random

rock_paper_scissor_project_bp = Blueprint("/projects/rock_paper_scissor/detect", __name__)

@rock_paper_scissor_project_bp.route('/projects/rock_paper_scissor/detect', methods=['POST'])
def gesture_detection():

    raw_data = request.data 
    user_choice = json.loads(raw_data.decode("utf-8"))["data"]
    computer_choice = random.choice(["Rock", "Paper", "Scissor"])

    # Determine result
    if user_choice == computer_choice:
        result = "Draw"
    elif (user_choice == "Rock" and computer_choice == "Scissor") or \
         (user_choice == "Paper" and computer_choice == "Rock") or \
         (user_choice == "Scissor" and computer_choice == "Paper"):
        result = "You Won"
    else:
        result = "Computer Won"

    # Return the result along with computer choice
    return result
