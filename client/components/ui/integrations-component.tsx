"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { FaDiscord, FaFigma, FaGithub, FaSlack } from 'react-icons/fa'
import { SiNotion } from 'react-icons/si'
import { VscCode } from 'react-icons/vsc'

export default function IntegrationsSection() {
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-2 opacity-100 md:translate-y-8 md:opacity-0'
      }`}>
      <div className="py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Integrate with your favorite tools
            </h2>
            <p className="text-muted-foreground mt-6">
              Connect seamlessly with popular platforms and services to enhance your workflow.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <IntegrationCard
              title="GitHub"
              description="Version control and collaboration platform for developers.">
              <GitHubLogo />
            </IntegrationCard>

            <IntegrationCard
              title="Slack"
              description="Team communication and collaboration hub.">
              <SlackLogo />
            </IntegrationCard>

            <IntegrationCard
              title="Notion"
              description="All-in-one workspace for notes, tasks, and projects.">
              <NotionLogo />
            </IntegrationCard>

            <IntegrationCard
              title="Figma"
              description="Collaborative design and prototyping platform.">
              <FigmaLogo />
            </IntegrationCard>

            <IntegrationCard
              title="Discord"
              description="Voice, video, and text chat platform for communities.">
              <DiscordLogo />
            </IntegrationCard>

            <IntegrationCard
              title="VS Code"
              description="Lightweight but powerful source code editor.">
              <VSCodeLogo />
            </IntegrationCard>
          </div>
        </div>
      </div>
    </section>
  )
}

const IntegrationCard = ({
  title,
  description,
  children,
  link = 'https://github.com/meschacirung/cnblocks',
}: {
  title: string
  description: string
  children: React.ReactNode
  link?: string
}) => {
  return (
    <Card className="p-6">
      <div className="relative">
        <div>{children}</div>

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button asChild variant="secondary" size="sm" className="gap-1 pr-2 shadow-none">
            <Link href={link}>
              Learn More
              <ChevronRight className="ml-0 size-3.5 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

const GitHubLogo = () => (
  <FaGithub className="size-10 text-black dark:text-white" aria-hidden="true" />
)

const SlackLogo = () => (
  <FaSlack className="size-10 text-purple-600" aria-hidden="true" />
)

const NotionLogo = () => (
  <SiNotion className="size-10 text-zinc-900 dark:text-zinc-100" aria-hidden="true" />
)

const FigmaLogo = () => (
  <FaFigma className="size-10 text-pink-500" aria-hidden="true" />
)

const DiscordLogo = () => (
  <FaDiscord className="size-10 text-indigo-500" aria-hidden="true" />
)

const VSCodeLogo = () => (
  <VscCode className="size-10 text-blue-600" aria-hidden="true" />
)
