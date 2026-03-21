import { useRef } from "react"
import { motion } from "framer-motion"

import { AnimatedBeam } from "@/components/ui/animated-beam"

export default function PipelineBeam({ metrics, documentName }) {
  const containerRef = useRef(null)
  const pdfRef = useRef(null)
  const scaleRef = useRef(null)
  const groqRef = useRef(null)
  const outRef = useRef(null)

  const originalTokens = metrics?.original_tokens ?? 0
  const compressedTokens = metrics?.compressed_tokens ?? 0
  const compressionPercentage = metrics?.compression_percentage ?? 0
  const tokensSaved = metrics?.tokens_saved ?? 0
  const MotionDiv = motion.div

  return (
    <MotionDiv
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      ref={containerRef}
      title={documentName}
      className="relative mb-6 flex w-full items-center justify-between rounded-2xl border border-card-border bg-navy-light px-8 py-6"
    >
      <div ref={pdfRef} className="flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-card-border bg-navy-light text-2xl shadow-lg">
          📄
        </div>
        <span className="font-body text-xs text-gray-400">PDF Document</span>
        <span className="font-mono text-xs text-saffron">{originalTokens} tokens</span>
      </div>

      <div ref={scaleRef} className="flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-card-border bg-navy-light text-2xl shadow-lg">
          ⚙️
        </div>
        <span className="font-body text-xs text-gray-400">ScaleDown</span>
        <span className="font-mono text-xs text-saffron">-{compressionPercentage}%</span>
      </div>

      <div ref={groqRef} className="flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-card-border bg-navy-light text-2xl shadow-lg">
          🤖
        </div>
        <span className="font-body text-xs text-gray-400">Groq LLaMA</span>
        <span className="font-mono text-xs text-saffron">{compressedTokens} tokens</span>
      </div>

      <div ref={outRef} className="flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-card-border bg-navy-light text-2xl shadow-lg">
          📋
        </div>
        <span className="font-body text-xs text-gray-400">Summary</span>
        <span className="font-mono text-xs text-saffron">Ready</span>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={pdfRef}
        toRef={scaleRef}
        pathColor="#FF6B00"
        pathOpacity={0.3}
        gradientStartColor="#FF6B00"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={scaleRef}
        toRef={groqRef}
        pathColor="#FF6B00"
        pathOpacity={0.3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={groqRef}
        toRef={outRef}
        pathColor="#10B981"
        pathOpacity={0.3}
        gradientStartColor="#10B981"
      />

      <span className="absolute left-[18%] top-[76%] -translate-x-1/2 font-mono text-xs text-emerald-400">
        {tokensSaved} tokens eliminated
      </span>
    </MotionDiv>
  )
}
