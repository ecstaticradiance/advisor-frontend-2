import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { MessageCircle, Brain, Shield, Eye, Send, Star, ThumbsUp, ThumbsDown, AlertCircle, FileText } from 'lucide-react'
import './App.css'

const API_BASE_URL = 'https://advisor-proto-agi.onrender.com'

function App() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' })
  const [showFeedback, setShowFeedback] = useState(false)
  
  // States for navigation tabs
  const [roadmapData, setRoadmapData] = useState(null)
  const [userStoriesData, setUserStoriesData] = useState(null)
  const [legalData, setLegalData] = useState(null)
  const [tabLoading, setTabLoading] = useState({})
  const [tabErrors, setTabErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)
    
    try {
      const res = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
      
      if (res.ok) {
        const data = await res.json()
        setResponse(data)
        setShowFeedback(true)
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        setError(errorData.error || `Server error: ${res.status}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Connection error. Please check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  const submitFeedback = async () => {
    if (!response || feedback.rating === 0) return

    try {
      const res = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_message: message,
          advisor_response: JSON.stringify(response),
          rating: feedback.rating,
          comment: feedback.comment,
        }),
      })
      
      if (res.ok) {
        setShowFeedback(false)
        setFeedback({ rating: 0, comment: '' })
      } else {
        // Handle error if feedback submission fails
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  // Functions to load data for navigation tabs
  const loadTabData = async (endpoint, setData, tabName) => {
    if (tabLoading[tabName]) return
    
    setTabLoading(prev => ({ ...prev, [tabName]: true }))
    setTabErrors(prev => ({ ...prev, [tabName]: null }))
    
    try {
      const res = await fetch(`${API_BASE_URL}/${endpoint}`)
      if (res.ok) {
        const data = await res.json()
        setData(data)
      } else {
        setTabErrors(prev => ({ ...prev, [tabName]: `Loading error: ${res.status}` }))
      }
    } catch (error) {
      console.error(`Error loading ${tabName}:`, error)
      setTabErrors(prev => ({ ...prev, [tabName]: 'Connection error' }))
    } finally {
      setTabLoading(prev => ({ ...prev, [tabName]: false }))
    }
  }

  // Load Roadmap from local JSON file
  const loadRoadmap = async () => {
    setTabLoading(prev => ({ ...prev, roadmap: true }))
    setTabErrors(prev => ({ ...prev, roadmap: null }))
    try {
      const res = await fetch('/roadmap.json')
      if (res.ok) {
        const data = await res.json()
        setRoadmapData(data)
      } else {
        setTabErrors(prev => ({ ...prev, roadmap: `Loading error: ${res.status}` }))
      }
    } catch (error) {
      console.error('Error loading roadmap JSON:', error)
      setTabErrors(prev => ({ ...prev, roadmap: 'Connection error' }))
    } finally {
      setTabLoading(prev => ({ ...prev, roadmap: false }))
    }
  }

  // Load User Stories from local JSON file
  const loadUserStories = async () => {
    setTabLoading(prev => ({ ...prev, userStories: true }))
    setTabErrors(prev => ({ ...prev, userStories: null }))
    try {
      const res = await fetch('/user_stories.json')
      if (res.ok) {
        const data = await res.json()
        setUserStoriesData(data)
      } else {
        setTabErrors(prev => ({ ...prev, userStories: `Loading error: ${res.status}` }))
      }
    } catch (error) {
      console.error('Error loading user stories JSON:', error)
      setTabErrors(prev => ({ ...prev, userStories: 'Connection error' }))
    } finally {
      setTabLoading(prev => ({ ...prev, userStories: false }))
    }
  }

  // Load legal documents from local folder
  const loadLegal = async () => {
    setTabLoading(prev => ({ ...prev, legal: true }))
    setTabErrors(prev => ({ ...prev, legal: null }))
    try {
      // Assuming a simple API endpoint or direct file listing is not available
      // We will hardcode the file names for now, or implement a backend endpoint to list files
      const files = [
        'IPAssignmentAgreementмеждутобойкакфизлицом(создателем)июридическимлицомFirstSentienceLtd.pdf',
        'LicenseЛицензия.pdf',
        'REGISTER.pdf',
        'CERTIFICATE.pdf'
      ];
      setLegalData({ title: 'Legal Documents', documents: files });
    } catch (error) {
      console.error('Error loading legal documents:', error)
      setTabErrors(prev => ({ ...prev, legal: 'Error loading legal documents' }))
    } finally {
      setTabLoading(prev => ({ ...prev, legal: false }))
    }
  }

  const ResponseBlock = ({ icon: Icon, title, content, color }) => (
    <Card className={`border-l-4 ${color}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  )

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <img src="/advisor_logo.png" alt="Advisor AGI Logo" className="mx-auto h-24 w-24 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Advisor AGI
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Smart AI-consultant with ethical and reasoned advice
            </p>
          </header>

          <Tabs defaultValue="chat" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="stories">User Stories</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Ask your question
                  </CardTitle>
                  <CardDescription>
                    Get structured advice with justification and ethical evaluation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                      placeholder="Describe your situation or ask a question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button type="submit" disabled={loading || !message.trim()} className="w-full">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Get advice
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {error && (
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      Error
                    </div>
                    <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
                  </CardContent>
                </Card>
              )}

              {response && (
                <div className="space-y-4">
                  <ResponseBlock
                    icon={Brain}
                    title="Advice"
                    content={response.advice}
                    color="border-l-blue-500"
                  />
                  <ResponseBlock
                    icon={Eye}
                    title="Reasoning"
                    content={response.reasoning_path}
                    color="border-l-green-500"
                  />
                  <ResponseBlock
                    icon={Shield}
                    title="Ethical Evaluation"
                    content={response.ethical_check}
                    color="border-l-yellow-500"
                  />
                  <ResponseBlock
                    icon={MessageCircle}
                    title="Self-assessment"
                    content={response.self_reflection}
                    color="border-l-purple-500"
                  />

                  {showFeedback && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Rate the response</CardTitle>
                        <CardDescription>
                          Your feedback will help improve the quality of advice
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button
                              key={star}
                              variant={feedback.rating >= star ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFeedback({ ...feedback, rating: star })}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                        <Textarea
                         placeholder="Additional comments (optional)"
                          value={feedback.comment}
                          onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <Button onClick={submitFeedback} disabled={feedback.rating === 0}>
                            Submit feedback
                          </Button>
                          <Button variant="outline" onClick={() => setShowFeedback(false)}>
                            Skip
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="roadmap">
              <Card>
                <CardHeader>
                  <CardTitle>Project Roadmap</CardTitle>
                  <CardDescription>
                    Advisor AGI Development Plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!roadmapData && !tabLoading.roadmap && !tabErrors.roadmap && (
                    <div className="text-center">
                      <Button onClick={loadRoadmap} variant="outline">
                        Load roadmap
                      </Button>
                    </div>
                  )}
                  
                  {tabLoading.roadmap && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      Loading roadmap...
                    </div>
                  )}
                  
                  {tabErrors.roadmap && (
                    <div className="text-red-600 dark:text-red-400">
                      {tabErrors.roadmap}
                      <Button onClick={loadRoadmap} variant="outline" size="sm" className="ml-2">
                        Retry
                      </Button>
                    </div>
                  )}
                  
                  {roadmapData && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">{roadmapData.title}</h3>
                      <div className="grid gap-4">
                        {roadmapData.phases?.map((phase) => (
                          <Card key={phase.id} className="border">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{phase.title}</CardTitle>
                                <Badge variant={phase.status === 'in_progress' ? 'default' : phase.status === 'planned' ? 'secondary' : 'outline'}>
                                  {phase.status === 'in_progress' ? 'In Progress' : 
                                   phase.status === 'planned' ? 'Planned' : 
                                   phase.status === 'research' ? 'Research' : phase.status}
                                </Badge>
                              </div>
                              <CardDescription>{phase.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{phase.completion}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${phase.completion}%` }}
                                  ></div>
                                </div>
                                <div className="mt-3">
                                  <p className="text-sm font-medium mb-2">Key Features:</p>
                                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    {phase.features?.map((feature, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {roadmapData.key_metrics && (
                        <Card className="bg-blue-50 dark:bg-blue-900/20">
                          <CardHeader>
                            <CardTitle className="text-lg">Key Metrics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Target Audience:</p>
                                <p className="text-gray-600 dark:text-gray-300">{roadmapData.key_metrics.target_users}</p>
                              </div>
                              <div>
                                <p className="font-medium">Accuracy Goal:</p>
                                <p className="text-gray-600 dark:text-gray-300">{roadmapData.key_metrics.accuracy_goal}</p>
                              </div>
                              <div>
                                <p className="font-medium">Response Time:</p>
                                <p className="text-gray-600 dark:text-gray-300">{roadmapData.key_metrics.response_time}</p>
                              </div>
                              <div>
                                <p className="font-medium">Availability:</p>
                                <p className="text-gray-600 dark:text-gray-300">{roadmapData.key_metrics.availability}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stories">
              <Card>
                <CardHeader>
                  <CardTitle>User Stories</CardTitle>
                  <CardDescription>
                    User stories and requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!userStoriesData && !tabLoading.userStories && !tabErrors.userStories && (
                    <div className="text-center">
                      <Button onClick={loadUserStories} variant="outline">
                        Load user stories
                      </Button>
                    </div>
                  )}
                  
                  {tabLoading.userStories && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      Loading user stories...
                    </div>
                  )}
                  
                  {tabErrors.userStories && (
                    <div className="text-red-600 dark:text-red-400">
                      {tabErrors.userStories}
                      <Button onClick={loadUserStories} variant="outline" size="sm" className="ml-2">
                        Retry
                      </Button>
                    </div>
                  )}
                  
                  {userStoriesData && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">{userStoriesData.title}</h3>
                      <div className="grid gap-4">
                        {userStoriesData.stories?.map((story) => (
                          <Card key={story.id} className="border">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{story.title}</CardTitle>
                                <Badge variant={story.priority === 'high' ? 'destructive' : story.priority === 'medium' ? 'default' : 'secondary'}>
                                  {story.priority === 'high' ? 'High' : 
                                   story.priority === 'medium' ? 'Medium' : 
                                   story.priority === 'low' ? 'Low' : story.priority}
                                </Badge>
                              </div>
                              <CardDescription>{story.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium mb-2">User:</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{story.user_type}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-2">Acceptance Criteria:</p>
                                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    {story.acceptance_criteria?.map((criteria, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                                        {criteria}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                {story.business_value && (
                                  <div>
                                    <p className="text-sm font-medium mb-2">Business Value:</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{story.business_value}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="architecture">
              <Card>
                <CardHeader>
                  <CardTitle>System Architecture</CardTitle>
                  <CardDescription>
                    Technical architecture of Advisor AGI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Button onClick={() => window.open("/presentation", "_blank")} variant="outline">
                      Open Architecture Presentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Information</CardTitle>
                  <CardDescription>
                    Legal aspects and compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!legalData && !tabLoading.legal && !tabErrors.legal && (
                    <div className="text-center">
                      <Button onClick={loadLegal} variant="outline">
                        Load legal information
                      </Button>
                    </div>
                  )}
                  
                  {tabLoading.legal && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500"></div>
                      Loading legal information...
                    </div>
                  )}
                  
                  {tabErrors.legal && (
                    <div className="text-red-600 dark:text-red-400">
                      {tabErrors.legal}
                      <Button onClick={loadLegal} variant="outline" size="sm" className="ml-2">
                        Retry
                      </Button>
                    </div>
                  )}
                  
                  {legalData && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">{legalData.title}</h3>
                      <div className="grid gap-4">
                        {legalData.documents?.map((doc, index) => (
                          <Card key={index} className="border">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                <a 
                                  href={`/legal_documents/${doc}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {doc}
                                </a>
                              </CardTitle>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Advisor FirstSentience Ltd. All rights reserved.
          </footer>
        </div>
      </div>
    </Router>
  )
}

export default App







