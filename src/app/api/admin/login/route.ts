"use client"

import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
// import { message } from "antd"

export async function POST(req:Request){
    try{
        const {email,password} = await req.json()
        if(!email || !password){
            return NextResponse.json({error:"Email and password required "},{status:400})
        }
        const client  = await clientPromise
        const database  = client.db("ExamAdmin")


    }
    catch(err){
        console.log(err)
        NextResponse.json({success:false,message:err},{status:500})
    }
}