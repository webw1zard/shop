"use client"
import React from 'react'
import Home from './_components/header'
import Footer from './_components/footer'
import Shop from './_components/shop'
import dynamic from 'next/dynamic';

const MySwiper = dynamic(() => import('./_components/swiper'), { ssr: false });
const page = () => {
  return (
    <div>
      <Home/>
      <MySwiper/>
      <Shop/>
      <Footer/>
    </div>
  )
}

export default page