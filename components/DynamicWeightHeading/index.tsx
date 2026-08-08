"use client";
import * as React from "react"
import { useEffect, useRef } from "react"
const useIsStaticRenderer = () => false
import { motion, useAnimationFrame } from "framer-motion"

export default function VariableFontCursorProximity(props: Props) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const {
        label,
        fromWeight,
        toWeight,
        strength,
        transition,
        style,
        className
    } = props

    const reach = Math.max(
        1,
        (Math.max(1, Math.min(100, strength!)) / 100) * MAX_REACH
    )

    const isStatic = useIsStaticRenderer()
    const containerRef = useRef<HTMLHeadingElement>(null)
    const letterRefs = useRef<Array<HTMLSpanElement | null>>([])
    const letterFactorsRef = useRef<number[]>([])
    const lastFrameRef = useRef(0)
    const mousePositionRef = useRef({ x: -99999, y: -99999 })

    useEffect(() => {
        if (isStatic) return

        const updatePosition = (clientX: number, clientY: number) => {
            mousePositionRef.current = { x: clientX, y: clientY }
        }
        const handleMouseMove = (ev: MouseEvent) =>
            updatePosition(ev.clientX, ev.clientY)
        const handleTouchMove = (ev: TouchEvent) => {
            if (ev.touches.length === 0) return
            updatePosition(ev.touches[0].clientX, ev.touches[0].clientY)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("touchmove", handleTouchMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("touchmove", handleTouchMove)
        }
    }, [isStatic])

    const fromSettings = `'wght' ${fromWeight}`

    useAnimationFrame((now: number) => {
        if (isStatic) return
        const container = containerRef.current
        if (!container) return
        const mx = mousePositionRef.current.x
        const my = mousePositionRef.current.y

        const prevT = lastFrameRef.current || now
        const dtSec = Math.min(0.1, Math.max(0, (now - prevT) / 1000))
        lastFrameRef.current = now

        const tau = Math.max(0.016, transition?.duration ?? 0.3)
        const a = 1 - Math.exp(-dtSec / tau)

        for (let i = 0; i < letterRefs.current.length; i++) {
            const letterEl = letterRefs.current[i]
            if (!letterEl) continue
            const rect = letterEl.getBoundingClientRect()
            const cx = rect.left + rect.width / 2
            const cy = rect.top + rect.height / 2
            const dx = mx - cx
            const dy = my - cy
            const dist = Math.sqrt(dx * dx + dy * dy)

            const target = Math.min(Math.max(1 - dist / reach, 0), 1)
            const prev = letterFactorsRef.current[i] ?? 0
            const f = prev + (target - prev) * a
            letterFactorsRef.current[i] = f

            if (f < 0.001) {
                if (letterEl.style.fontVariationSettings !== fromSettings) {
                    letterEl.style.fontVariationSettings = fromSettings
                    letterEl.style.fontWeight = fromWeight!.toString()
                }
                continue
            }

            const w = Math.round(fromWeight! + (toWeight! - fromWeight!) * f)
            letterEl.style.fontVariationSettings = `'wght' ${w}`
            letterEl.style.fontWeight = w.toString()
        }
    })

    const srOnlyStyle: React.CSSProperties = {
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
    }

    const innerSpanStyle: React.CSSProperties = {
        fontFamily: VARIABLE_FONT_STACK,
        textAlign: "inherit",
        display: "block",
        width: "100%",
        lineHeight: "inherit",
        fontWeight: fromWeight,
    }

    const words = label ? label.split(" ") : []

    letterRefs.current = []
    let letterIndex = 0

    return (
        <h2
            ref={containerRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "visible",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "inherit",
                justifyContent: "inherit",
                cursor: isStatic ? undefined : "pointer",
                ...style,
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: INTER_VARIABLE_FONT_FACE }} />
            {words.length === 0 ? null : (
                <span style={innerSpanStyle} className="dynamic-weight-inner">
                    <span style={srOnlyStyle}>{label}</span>
                    {words.map((word, wi) => {
                        const wordLetters = word.split("")
                        return (
                            <React.Fragment key={wi}>
                                <span
                                    aria-hidden
                                    style={{
                                        display: "inline-block",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {wordLetters.map((letter, li) => {
                                        const idx = letterIndex++
                                        return (
                                            <motion.span
                                                key={li}
                                                ref={(
                                                    el: HTMLSpanElement | null
                                                ) => {
                                                    letterRefs.current[idx] = el
                                                }}
                                                style={{
                                                    display: "inline-block",
                                                    fontVariationSettings:
                                                        fromSettings,
                                                    fontWeight: fromWeight,
                                                }}
                                            >
                                                {letter === " " ? "\u00A0" : letter}
                                            </motion.span>
                                        )
                                    })}
                                </span>
                                {wi < words.length - 1 && (
                                    <span
                                        aria-hidden
                                        style={{
                                            display: "inline-block",
                                        }}
                                    >
                                        &nbsp;
                                    </span>
                                )}
                            </React.Fragment>
                        )
                    })}
                </span>
            )}
        </h2>
    )
}

const INTER_VARIABLE_FONT_FACE = `
@font-face {
    font-family: "InterVariableFramer";
    src: url("https://rsms.me/inter/font-files/InterVariable.woff2?v=4.0") format("woff2-variations");
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
}
@font-face {
    font-family: "InterVariableFramer";
    src: url("https://rsms.me/inter/font-files/InterVariable-Italic.woff2?v=4.0") format("woff2-variations");
    font-weight: 100 900;
    font-style: italic;
    font-display: swap;
}
`

const VARIABLE_FONT_STACK = 'Kanit, sans-serif'

const MAX_REACH = 800

type Props = {
    label: string
    fromWeight?: number
    toWeight?: number
    strength?: number
    fontSize?: number | string
    color?: string
    transition?: any
    style?: React.CSSProperties
    className?: string
}

const COMPONENT_DEFAULTS = {
    label: "Variable Font Proximity",
    fontSize: 48,
    color: "inherit",
    fromWeight: 400,
    toWeight: 900,
    strength: 25,
    transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
    },
}
