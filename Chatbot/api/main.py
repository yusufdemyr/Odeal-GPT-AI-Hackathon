from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

from uuid import UUID
import os
from pydantic import BaseModel
from uuid import uuid4
import base64


from langchain_experimental.agents.agent_toolkits.csv.base import create_csv_agent
from langchain.chat_models import ChatOpenAI
from langchain.agents import AgentType

class Question(BaseModel):
    question: str
    question_id: str

os.environ["OPENAI_API_KEY"] = "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"



origin = ["*"]

app = FastAPI()

SESSION_DATA = {}


app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_gp4_agent(session_id):
    data = SESSION_DATA.get(session_id)
    if not data:
        raise Exception("Session not found")
    return data["gp4_agent"]

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/create_session")
async def create_session(user_id: str):
    session_id = str(uuid4())
    data_path = f"aktif_user/{user_id}.csv"
    SESSION_DATA[session_id] = {
            "gp4_agent": create_csv_agent(
                 ChatOpenAI(temperature=0, model_name="gpt-4"),
    data_path, verbose=True)
    }
    return {"session_id": session_id}

@app.get("/sessions")
async def get_session():
    keys = list(SESSION_DATA.keys())
    return {"sessions": keys}

@app.post("/question")
async def create_session(question: Question,session_id: str):
    try:
        gp4_agent = get_gp4_agent(session_id)
        prompt = f"""Aşağıdaki üçlü tırnak içerisindeki soruya Türkçe dilinde cevap ver.

        Eğer grafik, resim veya tablo isteniyorsa, matplotlib ile oluşturduğun görseli açmadan yalnızca 'response_temp_image/{question.question_id}.png' uzantısına kaydet ve grafikteki herşey türkçe olsun.

        Eğer soruda kampanya,fikir,strateji,öneri,promosyon vb. bir istek var ise bu isteği karşılayacak şekilde verideki bilgiler dahilinde örnek ile cevap ver.

        Eğer soruda üyelik yaşım nedir, ne kadar süredir üyeyim gibi bir soru var ise şuanki tarih - aktivasyon tarihi işlemini yaparak cevap ver.
     
        Final Answer her zaman Türkçe dilinde olmalıdır.
        
        Soru: '''{question.question}'''
        """
        response = gp4_agent.run(prompt)
        # get the response file
        response_file = f"response_temp_image/{question.question_id}.png"
        # read file and encode base64
        encoded_string = ""
        if(os.path.exists(response_file)):
            with open(response_file, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read())
            os.remove(response_file)
        encoded_string = str(encoded_string).replace("b'","").replace("'","").strip()
        # edit encoded string for img tag
        encoded_string = f"data:image/png;base64,{encoded_string}"
        return {"response": response, "image": encoded_string}

    except Exception as e:
        return Response(str(e), media_type="text/plain",status_code=500)


