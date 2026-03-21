import { motion } from "framer-motion"
import { BarChart3, BadgeDollarSign, Leaf, Timer, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { MagicCard } from "@/components/ui/magic-card"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ShimmerButton } from "@/components/ui/shimmer-button"

const MotionDiv = motion.div

function formatDensityBadge(value) {
  if (value > 0.7) {
    return {
      label: "High Density",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    }
  }

  if (value > 0.4) {
    return {
      label: "Medium",
      className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    }
  }

  return {
    label: "Low",
    className: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  }
}

function CardShell({ name, className, children }) {
  return (
    <BentoCard
      name={name}
      Icon={() => null}
      description=""
      href="#"
      cta=""
      className={[
        "group bg-transparent p-0 shadow-none dark:border-card-border dark:bg-transparent dark:shadow-none",
        "[&>div:nth-child(2)]:hidden [&>div:nth-child(3)]:hidden [&>div:nth-child(4)]:hidden",
        className,
      ].join(" ")}
      background={
        <MagicCard
          gradientColor="#FF6B00"
          gradientOpacity={0.05}
          className="h-full rounded-xl border border-card-border bg-navy-light"
        >
          {children}
        </MagicCard>
      }
    />
  )
}

export default function MetricsBento({ metrics, documentPages }) {
  const originalTokens = metrics?.original_tokens ?? 0
  const compressedTokens = metrics?.compressed_tokens ?? 0
  const tokensSaved = metrics?.tokens_saved ?? 0
  const compressionPercentage = Math.max(0, Math.min(100, metrics?.compression_percentage ?? 0))
  const compressionRatio = metrics?.compression_ratio ?? 0
  const energySavedKwh = metrics?.energy_saved_kwh ?? 0
  const co2SavedGrams = metrics?.co2_saved_grams ?? 0
  const costSavedUsd = metrics?.cost_saved_usd ?? 0
  const informationDensity = Math.max(0, Math.min(1, metrics?.information_density ?? 0))
  const scaledownLatencyMs = metrics?.scaledown_latency_ms ?? 0

  const keptWidth = Math.max(0, 100 - compressionPercentage)
  const energyProgress = Math.max(0, Math.min(100, (energySavedKwh / 0.1) * 100))
  const densityBadge = formatDensityBadge(informationDensity)

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  }

  return (
    <MotionDiv variants={gridVariants} initial="hidden" animate="show">
      <BentoGrid className="grid-cols-12 auto-rows-[minmax(220px,_auto)] gap-4">
        <MotionDiv variants={itemVariants} className="col-span-12 lg:col-span-7">
          <CardShell name="Token Compression" className="col-span-12 h-full lg:col-span-12">
            <div className="flex h-full flex-col p-6">
              <div className="mb-5 flex items-center gap-2">
                <Zap className="h-5 w-5 text-saffron" />
                <h3 className="font-display text-xl text-white">Token Compression</h3>
              </div>

              <NumberTicker
                value={tokensSaved}
                className="text-5xl font-display text-saffron"
              />
              <p className="mt-1 font-body text-sm text-gray-400">tokens eliminated</p>

              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-navy">
                <div
                  style={{ width: `${compressionPercentage}%` }}
                  className="h-full rounded-l-full bg-saffron transition-all duration-1000"
                />
                <div
                  style={{ width: `${keptWidth}%` }}
                  className="h-full rounded-r-full bg-emerald-500 transition-all duration-1000"
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Kept: {compressedTokens}</span>
                <span>Eliminated: {tokensSaved}</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  {compressionPercentage}% Compression
                </Badge>
                <span className="font-mono text-xs text-gray-500">
                  Ratio: {compressionRatio}x | Original: {originalTokens} tokens
                </span>
              </div>
            </div>
          </CardShell>
        </MotionDiv>

        <MotionDiv variants={itemVariants} className="col-span-12 lg:col-span-5">
          <CardShell name="Energy Saved" className="col-span-12 h-full lg:col-span-12">
            <div className="flex h-full flex-col p-6">
              <div className="mb-5 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-400" />
                <h3 className="font-display text-xl text-white">Energy Saved</h3>
              </div>

              <div className="flex items-end gap-2">
                <NumberTicker
                  value={energySavedKwh}
                  decimalPlaces={3}
                  className="text-3xl font-display text-emerald-400"
                />
                <span className="pb-1 font-body text-sm text-gray-400">kWh</span>
              </div>
              <p className="mt-1 font-body text-sm text-gray-400">kWh saved</p>

              <Separator className="my-4 bg-card-border/60" />

              <p className="font-body text-sm text-gray-300">≈ {co2SavedGrams}g CO₂ avoided</p>

              <Progress
                value={energyProgress}
                className="mt-4 h-2 bg-navy [&>div]:bg-emerald-500"
              />

              <p className="mt-3 font-body text-xs text-gray-500">
                India grid: 708g CO₂/kWh (CEA 2024)
              </p>
            </div>
          </CardShell>
        </MotionDiv>

        <MotionDiv variants={itemVariants} className="col-span-12 lg:col-span-4">
          <CardShell name="Cost Saved" className="col-span-12 h-full lg:col-span-12">
            <div className="flex h-full flex-col p-6">
              <div className="mb-5 flex items-center gap-2">
                <BadgeDollarSign className="h-5 w-5 text-gold" />
                <h3 className="font-display text-xl text-white">Cost Saved</h3>
              </div>

              <div className="flex items-end gap-1">
                <span className="pb-1 text-gold">$</span>
                <NumberTicker
                  value={costSavedUsd}
                  decimalPlaces={5}
                  className="text-3xl font-display text-gold"
                />
              </div>

              <p className="mt-1 font-body text-sm text-gray-400">vs uncompressed baseline</p>
              <p className="mt-4 font-body text-xs text-gray-500">GPT-4o input: $2.50/1M tokens</p>
            </div>
          </CardShell>
        </MotionDiv>

        <MotionDiv variants={itemVariants} className="col-span-12 lg:col-span-4">
          <CardShell name="Information Density" className="col-span-12 h-full lg:col-span-12">
            <div className="flex h-full flex-col p-6">
              <div className="mb-5 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-saffron" />
                <h3 className="font-display text-xl text-white">Information Density</h3>
              </div>

              <p className="text-4xl font-display text-saffron">
                {informationDensity.toFixed(2)}
              </p>
              <p className="mt-1 font-body text-sm text-gray-400">value preserved per token</p>

              <Progress
                value={informationDensity * 100}
                className="mt-3 h-2 bg-navy [&>div]:bg-saffron"
              />

              <Badge className={`mt-4 w-fit border ${densityBadge.className}`}>
                {densityBadge.label}
              </Badge>
            </div>
          </CardShell>
        </MotionDiv>

        <MotionDiv variants={itemVariants} className="col-span-12 lg:col-span-4">
          <CardShell name="Processing" className="col-span-12 h-full lg:col-span-12">
            <div className="flex h-full flex-col p-6">
              <div className="mb-5 flex items-center gap-2">
                <Timer className="h-5 w-5 text-gray-300" />
                <h3 className="font-display text-xl text-white">Processing</h3>
              </div>

              <div className="flex items-end gap-1">
                <NumberTicker
                  value={scaledownLatencyMs}
                  className="text-3xl font-display text-white"
                />
                <span className="pb-1 font-body text-sm text-gray-400">ms</span>
              </div>
              <p className="mt-1 font-body text-sm text-gray-400">ScaleDown compression</p>

              <Separator className="my-4 bg-card-border/60" />

              <p className="font-body text-sm text-gray-300">{documentPages} pages processed</p>

              <ShimmerButton
                shimmerColor="#FF6B00"
                background="rgba(17, 24, 39, 1)"
                borderRadius="8px"
                className="mt-4 w-fit px-4 py-2 text-xs"
              >
                Compression Optimized
              </ShimmerButton>
            </div>
          </CardShell>
        </MotionDiv>
      </BentoGrid>
    </MotionDiv>
  )
}
