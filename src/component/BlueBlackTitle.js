import React from 'react'

function BlueBlackTitle({blueText,blackText,className}) {
  return (
    <h2 className= {`text-[22px] font-[Poppins] font-medium ${className}`} >
        <span className=' text-[#05A6F0]'>{blueText}</span><span className=' text-black'>{blackText}</span>
    </h2>
  )
}

export default BlueBlackTitle