import React from 'react';
import { IoBagHandleOutline } from "react-icons/io5";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const HeroPng = "/images/f.png";
const LeafPng = "/images/leaf5.png";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section>


      <div
        className="container grid grid-cols-1 bg-gradient-to-b from-[#f0fff4] to-white md:grid-cols-2 min-h-[550px] relative">

        <div className='flex flex-col justify-center py-14 md:py-0 relative z-10'>
          <div className='text-center md:text-left space-y-6 lg:max-w-[400px]'>

            <motion.h1
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className='text-4xl lg:text-5xl font-bold leading-relaxed xl:leading-loose font-averia'>
              Organic
              <br />

              <span className='text-primary'>Fruits </span>&
              <br />

              <span className='text-secondary'>Vegetables!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className='text-2xl tracking-wide'>
              Order Now for a Fresh & Healthy Life
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className='text-gray-400'>

              Fresh organic fruits and vegetables delivered straight
              to your home. Start your morning with natural, healthy,
              and chemical-free food. Eat fresh every day for a strong
              body and healthy mind.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className='flex justify-center md:justify-start mt-6'>

              <button
                onClick={() => navigate("/products")}
                className='primary-btn flex items-center gap-2'>

                <span>
                  <IoBagHandleOutline />
                </span>

                Order Now
              </button>

            </motion.div>
          </div>
        </div>

        <div className='flex justify-center items-center'>

          <motion.img
            initial={{ opacity: 0, x: 200, rotate: 75 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.2, delay: 1.5 }}
            src={HeroPng}
            alt=''
            className='w-[350px] md:w-[550px]'/>
        </div>

        <div
          className='absolute top-14 md:top-0 right-1/2 blur-sm
          opacity-80 rotate-[30deg]'>

          <motion.img
            initial={{ opacity: 0, x: -200, rotate: 75 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{
              duration: 1.2,
              delay: 1.5,
              ease: "easeOut"
            }}
            src={LeafPng}
            alt=''
            className='w-full md:max-w-[500px]'/>
        </div>
      </div>


      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div
            onClick={() =>
              navigate("/products?category=Vegetables")
            }
            className="bg-green-100 rounded-3xl p-6 relative overflow-hidden shadow-lg min-h-[250px] 
            cursor-pointer hover:scale-105 duration-300">

            <div className="space-y-4 relative z-10">
              <p className="text-green-700 font-semibold">
                Good For Health
              </p>

              <h2 className="text-3xl font-bold text-gray-800">
                ORGANIC <br /> VEGETABLES
              </h2>
            </div>

            <img
              src="/images/f1.png"
              alt=""
              className="w-40 absolute bottom-0 right-0"/>
          </div>

          

          
          <div
            onClick={() =>
              navigate("/products?category=Fruits")
            }

            className="bg-orange-100 rounded-3xl p-6 relative overflow-hidden shadow-lg 
            min-h-[250px] cursor-pointer hover:scale-105 duration-300">

            <div className="space-y-4 relative z-10">

              <p className="text-orange-700 font-semibold">
                High Fiber Content
              </p>

              <h2 className="text-3xl font-bold text-gray-800">
                NATURAL <br /> FRUITS
              </h2>
            </div>

            <img
              src="/images/f2.png"
              alt=""
              className="w-40 absolute bottom-0 right-0"
            />
          </div>

          <div
            onClick={() =>
              navigate("/products?category=Leaves")
            }

            className="bg-lime-100 rounded-3xl p-6 relative overflow-hidden shadow-lg 
            min-h-[250px] cursor-pointer hover:scale-105 duration-300">

            <div className="space-y-4 relative z-10">

              <p className="text-lime-700 font-semibold">
                High Minerals
              </p>

              <h2 className="text-3xl font-bold text-gray-800">
                FRESH <br /> LEAVES
              </h2>
            </div>

            <img
              src="/images/f3.png"
              alt=""
              className="w-40 absolute bottom-0 right-0"/>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Hero;