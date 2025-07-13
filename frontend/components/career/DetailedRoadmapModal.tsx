'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, ExternalLink } from 'lucide-react';

interface DetailedRoadmapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roadmapData: any;
  domainSlug: string;
}

export default function DetailedRoadmapModal({
  open,
  onOpenChange,
  roadmapData,
  domainSlug,
}: DetailedRoadmapModalProps) {
  
  const mermaidChart = `
    graph TD
      A[Start Your Journey] --> B[Phase 1: Foundation]
      B --> C{Assessment}
      C -->|Pass| D[Phase 2: Core Skills]
      C -->|Need Review| B
      D --> E{Intermediate Assessment}
      E -->|Pass| F[Phase 3: Advanced Topics]
      E -->|Need Review| D
      F --> G{Advanced Assessment}
      G -->|Pass| H[Phase 4: Specialization]
      G -->|Need Review| F
      H --> I[Portfolio Projects]
      I --> J[Job Applications]
      J --> K[Career Success]
      
      style A fill:#e1f5fe
      style K fill:#c8e6c9
      style B fill:#fff3e0
      style D fill:#fff3e0
      style F fill:#fce4ec
      style H fill:#f3e5f5
  `;

  const handleDownloadPDF = () => {
    // Simulate PDF download
    const element = document.createElement('a');
    const file = new Blob(['Detailed Roadmap Content'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${domainSlug}-roadmap.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">
            Detailed {roadmapData.title}
          </DialogTitle>
          <DialogDescription>
            Complete learning path with milestones, resources, and assessments
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Flowchart Visualization */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
                Learning Flow Diagram
              </h3>
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-dashed border-slate-300 dark:border-slate-600">
                <div className="text-center py-12">
                  <div className="text-slate-500 dark:text-slate-400 mb-4">
                    Interactive Flowchart Visualization
                  </div>
                  <div className="text-sm text-slate-400 dark:text-slate-500">
                    (Mermaid diagram would be rendered here in production)
                  </div>
                  <pre className="text-xs text-left mt-4 bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-auto">
                    {mermaidChart}
                  </pre>
                </div>
              </div>
            </div>

            {/* Detailed Phase Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Detailed Phase Breakdown
              </h3>
              
              {roadmapData.phases.map((phase: any, index: number) => (
                <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Phase {index + 1}: {phase.phase} ({phase.duration})
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {phase.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                        Learning Objectives:
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {phase.topics.map((topic: string, topicIndex: number) => (
                          <li key={topicIndex} className="flex items-start gap-2">
                            <span className="text-indigo-500 mt-1">•</span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                        Practical Projects:
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        {phase.projects.map((project: string, projectIndex: number) => (
                          <li key={projectIndex} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resources Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                Recommended Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Online Courses
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Coursera Machine Learning Course</li>
                    <li>• edX Introduction to Computer Science</li>
                    <li>• Udacity Nanodegree Programs</li>
                    <li>• Khan Academy Mathematics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Books & Documentation
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• "Hands-On Machine Learning" by Aurélien Géron</li>
                    <li>• "Clean Code" by Robert Martin</li>
                    <li>• Official Framework Documentation</li>
                    <li>• Research Papers and Journals</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Assessment Milestones */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                Assessment Milestones
              </h3>
              <div className="space-y-3">
                {roadmapData.phases.map((phase: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-green-900 dark:text-green-100">
                        {phase.phase} Assessment
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Complete projects and pass knowledge check
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex justify-between items-center p-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}