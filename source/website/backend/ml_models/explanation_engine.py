def generate_explanation(user_pred, ai_pred, actual, confidence):
    explanation = ""

    if ai_pred == actual:
        explanation += "AI prediction was correct. "

        if user_pred == actual:
            explanation += "Your prediction aligned with AI and market outcome."
        else:
            explanation += "Your prediction differed from AI but market followed AI signals."

    else:
        explanation += "AI prediction was incorrect due to market volatility. "

        if user_pred == actual:
            explanation += "However, your intuition was correct."
        else:
            explanation += "Both AI and your prediction were affected by unexpected market movement."

    explanation += f" AI confidence level was {confidence}%."

    return explanation