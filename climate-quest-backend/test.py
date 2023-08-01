from dotenv import load_dotenv
import os

load_dotenv()  # take environment variables from .env.
var_name = os.getenv('API_KEY')

print(var_name)  # prints: Variable Value