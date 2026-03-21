import { useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, FileText, Upload } from "lucide-react"

import { DotPattern } from "@/components/ui/dot-pattern"
import { Progress } from "@/components/ui/progress"
import { ShimmerButton } from "@/components/ui/shimmer-button"

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

function formatFileSize(size) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

function truncateName(name, maxLength = 48) {
  if (name.length <= maxLength) return name
  return `${name.slice(0, maxLength - 3)}...`
}

export default function UploadZone({ onAnalyze, isLoading, error }) {
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [localError, setLocalError] = useState(null)

  const effectiveError = error || localError

  const selectedInfo = useMemo(() => {
    if (!file) return null
    return {
      name: truncateName(file.name),
      size: formatFileSize(file.size),
    }
  }, [file])

  const resetState = () => {
    setFile(null)
    setLocalError(null)
    setIsDragOver(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  const validateAndSetFile = (nextFile) => {
    if (!nextFile) return

    const isPdf = nextFile.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      setLocalError("Only PDF files are supported.")
      setFile(null)
      return
    }

    if (nextFile.size > MAX_FILE_SIZE_BYTES) {
      setLocalError("File too large. Please upload a PDF under 50MB.")
      setFile(null)
      return
    }

    setLocalError(null)
    setFile(nextFile)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragOver(false)
    const droppedFile = event.dataTransfer?.files?.[0]
    validateAndSetFile(droppedFile)
  }

  const handleFilePick = (event) => {
    const pickedFile = event.target.files?.[0]
    validateAndSetFile(pickedFile)
  }

  const handleAnalyze = async (event) => {
    event.stopPropagation()
    if (!file || isLoading) return
    await onAnalyze(file)
  }

  const handleCardClick = () => {
    if (isLoading) return
    inputRef.current?.click()
  }

  return (
    <motion.div
      initial={false}
      animate={{ scale: isDragOver ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleCardClick}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={[
        "bg-navy-light rounded-2xl p-10 border-2 cursor-pointer",
        "relative overflow-hidden min-h-[320px] flex items-center justify-center",
        "transition-all duration-300",
        isDragOver
          ? "border-saffron shadow-[0_0_40px_rgba(255,107,0,0.3)] bg-saffron/5"
          : "border-dashed border-saffron/30 hover:border-saffron/70 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)]",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFilePick}
      />

      <DotPattern
        className="absolute inset-0"
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        style={{ color: "#FF6B00", opacity: 0.12 }}
      />

      <div className="relative z-10 w-full max-w-xl text-center">
        <AnimatePresence mode="wait">
          {effectiveError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <AlertCircle className="text-rose-400" size={48} />
              <p className="mt-4 font-body text-rose-300">{effectiveError}</p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  resetState()
                }}
                className="mt-5 rounded-md border border-card-border px-4 py-2 text-sm text-white hover:bg-white/5"
              >
                Try Again
              </button>
            </motion.div>
          ) : file ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <FileText className="text-saffron" size={48} />
              <p className="mt-4 max-w-full truncate font-body text-white">{selectedInfo?.name}</p>
              <p className="mt-1 text-sm text-gray-400">{selectedInfo?.size}</p>

              <ShimmerButton
                shimmerColor="#FF6B00"
                background="#111827"
                className="mt-4 w-full"
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Analyze Document →"}
              </ShimmerButton>

              {isLoading ? <Progress value={68} className="mt-4" /> : null}

              <p className="mt-3 text-xs text-gray-400">
                Powered by ScaleDown Token Compression × Groq
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <Upload className="text-saffron" size={48} />
              <h3 className="mt-4 font-display text-3xl text-white">
                {isDragOver ? "Drop to analyze →" : "Upload a Legal Document"}
              </h3>
              <p className="mt-3 font-body text-gray-400">
                Bills • Acts • Policies • Government Orders
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}