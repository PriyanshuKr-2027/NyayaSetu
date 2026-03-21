import { useState } from "react"
import { toast } from "sonner"

import LoadingOrbit from "@/components/LoadingOrbit"
import MetricsBento from "@/components/MetricsBento"
import PipelineBeam from "@/components/PipelineBeam"
import SummaryPanel from "@/components/SummaryPanel"
import UploadZone from "@/components/UploadZone"
import { Badge } from "@/components/ui/badge"
import { Particles } from "@/components/ui/particles"
import ShinyText from "@/components/ui/shiny-text"
import { Toaster } from "@/components/ui/sonner"
import WordPullUp from "@/components/ui/word-pull-up"
import api from "@/lib/api"

function App() {
  const [appState, setAppState] = useState("idle")
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async (file) => {
    setAppState("loading")
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await api.post("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setResult(response.data)
      setAppState("done")
    } catch (requestError) {
      const errorMessage =
        requestError?.response?.data?.detail || "Analysis failed"
      setError(errorMessage)
      setAppState("error")
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-navy text-white">
      <header className="sticky top-0 z-50 border-b border-card-border bg-navy/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">⚖️ NyayaSetu</h1>
            <p className="font-body text-xs italic text-gray-500">
              Decoding Indian Law for Every Citizen
            </p>
          </div>

          <div className="flex gap-2">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              ScaleDown
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Groq LLaMA 3.3
            </Badge>
            <Badge className="hidden bg-blue-500/20 text-blue-400 border-blue-500/30 md:flex">
              HPE GenAI for GenZ
            </Badge>
          </div>
        </div>
      </header>

      {appState === "idle" ? (
        <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
          <Particles
            className="absolute inset-0"
            quantity={60}
            color="#FF6B00"
            style={{ opacity: 0.25 }}
          />

          <div className="relative z-10 w-full max-w-2xl text-center">
            <WordPullUp
              words="Indian Law, Finally Explained"
              className="mb-4 font-display text-4xl font-bold text-white md:text-6xl"
            />

            <ShinyText
              text="Upload any bill, act, or policy PDF — get a citizen-friendly summary in seconds"
              className="mb-10 block font-body text-lg text-gray-400"
            />

            <UploadZone onAnalyze={handleAnalyze} isLoading={false} error={error} />

            <p className="mt-8 font-body text-xs text-gray-600">
              Handles documents up to 100,000+ tokens • ScaleDown compression • Free to use
            </p>
          </div>
        </main>
      ) : null}

      {appState === "loading" ? <LoadingOrbit /> : null}

      {appState === "done" && result ? (
        <main className="mx-auto w-full max-w-7xl px-4 py-8">
          <PipelineBeam
            metrics={result.metrics}
            documentName={result.document_name}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SummaryPanel
                summary={result.summary}
                documentName={result.document_name}
                documentPages={result.document_pages}
                metrics={result.metrics}
                onReset={() => setAppState("idle")}
              />
            </div>

            <div className="lg:col-span-7">
              <MetricsBento
                metrics={result.metrics}
                documentPages={result.document_pages}
              />
            </div>
          </div>
        </main>
      ) : null}

      {appState === "error" ? (
        <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
          <div className="relative z-10 w-full max-w-2xl">
            <UploadZone onAnalyze={handleAnalyze} isLoading={false} error={error} />
          </div>
        </main>
      ) : null}

      <footer className="mt-16 border-t border-card-border py-6 text-center">
        <p className="font-body text-xs text-gray-600">
          Built for HPE GenAI for GenZ × ScaleDown Challenge • India 🇮🇳 • {new Date().getFullYear()}
        </p>
      </footer>

      <Toaster />
    </div>
  )
}

export default App
