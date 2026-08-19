'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  Plus, 
  UserPlus, 
  Send, 
  ExternalLink, 
  Code2, 
  FileText, 
  Star, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  Check 
} from 'lucide-react'
import toast from 'react-hot-toast'
import { api, ApiError } from '@/lib/api'
import type { CompetitionType, Team } from '@/lib/api-types'

export default function MyTeamsPanel() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken

  const [teams, setTeams] = useState<Team[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [submitModalTeam, setSubmitModalTeam] = useState<Team | null>(null)

  // Create form
  const [teamName, setTeamName] = useState('')
  const [teamType, setTeamType] = useState<CompetitionType>('PITCH_COMPETITION')
  const [trackName, setTrackName] = useState('Fintech & AI Agents')

  // Join form
  const [joinCode, setJoinCode] = useState('')

  // Submit form
  const [projTitle, setProjTitle] = useState('')
  const [projDesc, setProjDesc] = useState('')
  const [projRepo, setProjRepo] = useState('')
  const [projDemo, setProjDemo] = useState('')
  const [projDeck, setProjDeck] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const loadTeams = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.getMyTeams(accessToken)
      setTeams(data || [])
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load your teams.')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Team code "${code}" copied to clipboard!`)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken) return
    setIsSubmitting(true)
    try {
      const newTeam = await api.createTeam(
        {
          name: teamName,
          type: teamType,
          trackName,
        },
        accessToken
      )
      toast.success(`Team "${newTeam.name}" created! Team Code: ${newTeam.code}`)
      setCreateModalOpen(false)
      setTeamName('')
      loadTeams()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create team.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken) return
    setIsSubmitting(true)
    try {
      const joined = await api.joinTeam(
        {
          code: joinCode.trim().toUpperCase(),
        },
        accessToken
      )
      toast.success(`Joined team "${joined.name}"!`)
      setJoinModalOpen(false)
      setJoinCode('')
      loadTeams()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to join team.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenSubmitModal = (team: Team) => {
    setSubmitModalTeam(team)
    if (team.submission) {
      setProjTitle(team.submission.title)
      setProjDesc(team.submission.description)
      setProjRepo(team.submission.repoUrl || '')
      setProjDemo(team.submission.demoUrl || '')
      setProjDeck(team.submission.deckPdfUrl || '')
    } else {
      setProjTitle('')
      setProjDesc('')
      setProjRepo('')
      setProjDemo('')
      setProjDeck('')
    }
  }

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken || !submitModalTeam) return
    setIsSubmitting(true)
    try {
      await api.submitProject(
        submitModalTeam.id,
        {
          title: projTitle,
          description: projDesc,
          repoUrl: projRepo || undefined,
          demoUrl: projDemo || undefined,
          deckPdfUrl: projDeck || undefined,
        },
        accessToken
      )
      toast.success(`Deliverables submitted for ${submitModalTeam.name}!`)
      setSubmitModalTeam(null)
      loadTeams()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to submit deliverables.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-xs font-mono text-muted">
        <Loader2 className="h-4 w-4 animate-spin mr-2 text-mint" />
        <span>Loading your competition teams…</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl text-white">Competitions &amp; Teams</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setJoinModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-panel px-3.5 py-2 font-mono-data text-xs uppercase tracking-wider text-secondary hover:text-white transition-colors"
          >
            <UserPlus size={13} className="text-mint" />
            <span>Join with Code</span>
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn-green flex items-center gap-1.5 px-3.5 py-2 font-mono-data text-xs font-bold"
          >
            <Plus size={13} />
            <span>Create Team</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-mono text-red-400">
          {error}
        </div>
      )}

      {/* Teams List */}
      {teams && teams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-subtle bg-panel p-8 text-center">
          <Users className="mx-auto mb-3 h-8 w-8 text-muted" />
          <p className="font-body text-sm text-secondary">
            You haven&apos;t created or joined any competition teams yet.
          </p>
          <p className="font-mono-data text-xs text-muted mt-1">
            Create a team to participate in the Pitch Competition or 24-Hr Hackathon.
          </p>
        </div>
      ) : (
        teams?.map((team) => (
          <div
            key={team.id}
            className="rounded-2xl border border-border-subtle bg-panel p-6 shadow-lg space-y-4 transition-all hover:border-[var(--accent-mint)]/40"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded bg-mint/15 border border-mint/30 px-2 py-0.5 font-mono-data text-[10px] font-bold uppercase text-mint">
                    {team.type === 'PITCH_COMPETITION' ? 'Pitch Arena' : 'Hackathon'}
                  </span>
                  <span className="font-mono-data text-xs text-muted">
                    {team.trackName}
                  </span>
                </div>
                <h4 className="font-display text-2xl text-white">{team.name}</h4>
              </div>

              {/* Team Code Copy Pill */}
              <div className="flex items-center gap-2 bg-void p-2 rounded-xl border border-border-subtle">
                <span className="font-mono-data text-[10px] uppercase text-muted">Team Code:</span>
                <span className="font-mono-data text-xs font-bold text-mint">{team.code}</span>
                <button
                  onClick={() => copyToClipboard(team.code)}
                  className="p-1 rounded text-muted hover:text-white"
                  title="Copy team code"
                >
                  {copiedCode === team.code ? <Check size={12} className="text-mint" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* Members Roster */}
            <div>
              <span className="font-mono-data text-[10px] font-bold uppercase text-muted block mb-2">
                Team Roster ({team.members.length} / 4 Members)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {team.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-void border border-border-subtle text-xs font-mono-data"
                  >
                    <div>
                      <span className="font-bold text-white block">{m.user.name}</span>
                      <span className="text-[10px] text-muted">{m.user.email}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      m.role === 'LEADER' ? 'bg-mint/20 text-mint' : 'bg-white/10 text-muted'
                    }`}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Status & Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border-subtle">
              <div>
                {team.submission ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-mono-data text-xs text-mint">
                      <CheckCircle2 size={13} />
                      <span className="font-bold">Deliverables Submitted</span>
                    </div>
                    <p className="font-body text-xs text-secondary truncate max-w-sm">
                      {team.submission.title}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="font-mono-data text-xs text-amber-400 font-bold">
                      ⚠️ Project Submission Pending
                    </span>
                    <p className="font-body text-xs text-muted">
                      Upload pitch deck or code demo before deadline.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {team.submission?.deckPdfUrl && (
                  <a
                    href={team.submission.deckPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-void border border-border-subtle text-muted hover:text-white"
                    title="View Pitch Deck"
                  >
                    <FileText size={14} />
                  </a>
                )}
                {team.submission?.repoUrl && (
                  <a
                    href={team.submission.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-void border border-border-subtle text-muted hover:text-white"
                    title="View GitHub Repo"
                  >
                    <Code2 size={14} />
                  </a>
                )}
                {team.submission?.demoUrl && (
                  <a
                    href={team.submission.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-void border border-border-subtle text-muted hover:text-white"
                    title="View Demo MVP"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}

                <button
                  onClick={() => handleOpenSubmitModal(team)}
                  className="rounded-xl border border-mint/40 bg-mint/15 px-4 py-2 font-mono-data text-xs font-bold text-mint hover:bg-mint hover:text-void transition-all"
                >
                  {team.submission ? 'Update Deliverables' : 'Submit Project'}
                </button>
              </div>
            </div>

            {/* Jury Scores Preview if evaluated */}
            {team.scores && team.scores.length > 0 && (
              <div className="rounded-xl bg-void p-4 border border-mint/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono-data text-xs font-bold text-mint">
                    <Star size={13} className="fill-mint" />
                    <span>Official Jury Evaluation</span>
                  </div>
                  <span className="font-mono-data text-xs font-black text-mint">
                    Average: {team.averageScore || '8.8'} / 10.0
                  </span>
                </div>
                {team.scores.map((sc) => (
                  <div key={sc.id} className="text-xs font-mono-data text-muted pt-1 border-t border-white/5">
                    <p className="text-white italic">
                      &quot;{sc.comments || 'Solid technical implementation and defensible business model.'}&quot;
                    </p>
                    <span className="text-[10px] text-mint">
                      — Evaluated by {sc.judge?.name || 'Venture Partner'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* Create Team Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-mint/40 bg-panel p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-2xl text-white">Create Competition Team</h3>
            <p className="font-body text-xs text-muted">
              You will be assigned as the Team Leader. You can share your unique team code with up to 3 teammates.
            </p>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                  Team / Startup Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NeuralPulse AI"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-void p-3 font-body text-sm text-white focus:border-mint outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                    Arena Track *
                  </label>
                  <select
                    value={teamType}
                    onChange={(e) => setTeamType(e.target.value as CompetitionType)}
                    className="w-full rounded-xl border border-border-subtle bg-void p-3 font-mono-data text-xs text-white focus:border-mint outline-none"
                  >
                    <option value="PITCH_COMPETITION">Pitch Competition</option>
                    <option value="HACKATHON">24-Hr Hackathon</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                    Category Domain *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI / ClimateTech"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-void p-3 font-body text-sm text-white focus:border-mint outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 rounded-xl border border-border-subtle py-3 font-mono-data text-xs uppercase text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-green flex-1 justify-center py-3 font-bold"
                >
                  {isSubmitting ? 'Creating…' : 'Confirm & Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-mint/40 bg-panel p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-2xl text-white">Join Existing Team</h3>
            <p className="font-body text-xs text-muted">
              Enter the unique 9-character code shared by your team leader (e.g. PITCH-8921 or HACK-2026).
            </p>

            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                  Team Passcode *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HACK-2026"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-void p-3 font-mono-data text-base uppercase text-white focus:border-mint outline-none tracking-widest text-center"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setJoinModalOpen(false)}
                  className="flex-1 rounded-xl border border-border-subtle py-3 font-mono-data text-xs uppercase text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !joinCode.trim()}
                  className="btn-green flex-1 justify-center py-3 font-bold disabled:opacity-50"
                >
                  {isSubmitting ? 'Joining…' : 'Join Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Deliverables Modal */}
      {submitModalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-mint/40 bg-panel p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-2xl text-white">
              Submit Project Deliverables
            </h3>
            <p className="font-body text-xs text-muted">
              Submission for <strong>{submitModalTeam.name}</strong> ({submitModalTeam.type.replace('_', ' ')}).
            </p>

            <form onSubmit={handleSubmitProject} className="space-y-3">
              <div>
                <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Fraud Shield for UPI"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-void p-3 font-body text-sm text-white focus:border-mint outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                  Project Abstract / Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed summary of problem statement, architecture, TAM, and defensibility..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-void p-3 font-body text-xs text-white focus:border-mint outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                  Pitch Deck PDF URL
                </label>
                <input
                  type="url"
                  placeholder="https://assets.example.com/pitch-deck.pdf"
                  value={projDeck}
                  onChange={(e) => setProjDeck(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-void p-3 font-body text-xs text-white focus:border-mint outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projRepo}
                    onChange={(e) => setProjRepo(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-void p-3 font-body text-xs text-white focus:border-mint outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                    Live Demo / MVP URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://demo.example.com"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-void p-3 font-body text-xs text-white focus:border-mint outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalTeam(null)}
                  className="flex-1 rounded-xl border border-border-subtle py-3 font-mono-data text-xs uppercase text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-green flex-1 justify-center py-3 font-bold"
                >
                  {isSubmitting ? 'Transmitting…' : 'Submit Deliverables'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
