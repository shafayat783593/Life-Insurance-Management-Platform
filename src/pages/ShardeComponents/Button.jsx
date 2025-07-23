import React from 'react'
import { motion } from "framer-motion";

function Button() {
  return (
    <div>
          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition-all"
          >
              🚀 Subscribe Now
          </motion.button>
    </div>
  )
}

export default Button
