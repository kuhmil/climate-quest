# climate-quest


poetry run uvicorn main:app --reload

poetry export -f requirements.txt -o requirements.txt
poetry export -f requirements.txt --without-hashes -o requirements.txt
awk -F';' '{print $1}' input.txt > output.txt
