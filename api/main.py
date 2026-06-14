from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.extra_modules.auth import routers as auth
from api.routers import  user
from api.routers import  words
from api.routers import  translate

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")



    
app.include_router(user.router)
app.include_router(words.router)
app.include_router(auth.router)
app.include_router(translate.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
       "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
