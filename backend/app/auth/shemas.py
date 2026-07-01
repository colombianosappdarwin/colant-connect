from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    gender: str
    phone: str
    city_origin: str
    industry: str
    visa_type: str