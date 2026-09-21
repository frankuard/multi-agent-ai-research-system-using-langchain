from langchain.agents import create_agent
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search,scrape_url
from dotenv import load_dotenv 
load_dotenv()


##model setup
llm = ChatGroq(
    model= "openai/gpt-oss-120b",
    temperature=0
)

# 1st agent

def build_search_agent():
    return create_agent(
        model= llm,
        tools= [web_search]
    )

