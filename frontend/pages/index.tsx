import React,{useEffect,useState} from 'react'

function index() {
  useEffect(()=>{
    console.log('index')
  },[]);


  return (
    <div>index</div>
  )
}

export default index