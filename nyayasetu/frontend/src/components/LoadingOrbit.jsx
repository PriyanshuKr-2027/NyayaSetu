import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { OrbitingCircles } from "@/components/ui/orbiting-circles"

const statusMessages = [
  "📄 Extracting document text...",
  "⚙️ Compressing with ScaleDown...",
  "🤖 Groq AI analyzing context...",
  "📋 Generating citizen summary...",
]

export default function LoadingOrbit() {
  const [messageIndex, setMessageIndex] = useState(0)
  const MotionP = motion.p

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % statusMessages.length)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative flex h-[320px] w-[320px] items-center justify-center">
        <OrbitingCircles radius={55} duration={12}>
          <span className="text-2xl">⚖️</span>
        </OrbitingCircles>

        <OrbitingCircles radius={90} duration={20} reverse>
          <span className="text-2xl">📄</span>
        </OrbitingCircles>

        <OrbitingCircles radius={130} duration={28}>
          <span className="text-2xl">✨</span>
        </OrbitingCircles>

        <div className="font-display text-2xl text-saffron">AI</div>
      </div>

      <div className="mt-12 min-h-8">
        <AnimatePresence mode="wait">
          <MotionP
            key={statusMessages[messageIndex]}
            className="font-body text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {statusMessages[messageIndex]}
          </MotionP>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full bg-saffron animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-saffron animate-pulse"
            style={{ animationDelay: "200ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-saffron animate-pulse"
            style={{ animationDelay: "400ms" }}
          />
        </div>

        <p className="font-body text-xs text-gray-500">
          Large documents may take 20-40 seconds
        </p>
      </div>
    </div>
  )
}
