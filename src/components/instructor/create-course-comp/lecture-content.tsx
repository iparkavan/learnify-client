import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Play,
  FileText,
  Upload,
  X,
  Plus,
  Trash2,
  Video,
  File,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code,
  BookOpen,
  Link as LinkIcon,
  Clock,
  GripVertical,
} from "lucide-react";
import axios, { AxiosProgressEvent } from "axios";
import { CloudinaryUploadResponse } from "@/types/cloudinary-types";
import axiosClient from "@/utils/axios-client";
import { LectureType } from "@/lms-pages/instructor/course-creation/create-course";
import { minutesToSeconds } from "@/utils/contants";

// Types
export interface VideoContent {
  file?: File;
  fileName?: string;
  fileSize?: string;
  duration?: number;
  uploadProgress?: number;
  isUploaded?: boolean;
  url?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizContent {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore?: number;
  timeLimit?: number;
}

export interface CodingExerciseContent {
  title: string;
  description: string;
  language: string;
  starterCode: string;
  solutionCode: string;
  testCases: { input: string; expectedOutput: string }[];
  hints?: string[];
}

export interface AssignmentContent {
  title: string;
  instructions: string;
  attachments?: { name: string; size: string }[];
  dueInDays?: number;
  estimatedTime?: string;
}

export interface LectureContent {
  video?: VideoContent;
  quiz?: QuizContent;
  coding?: CodingExerciseContent;
  assignment?: AssignmentContent;
  resources?: { name: string; type: string; url?: string; file?: File }[];
  description?: string;
}

// Enum for TS

interface LectureContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectureType: LectureType;
  lectureTitle: string;
  initialContent?: LectureContent;
  onSave: (content: LectureContent) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const LectureContentModal = ({
  isOpen,
  onClose,
  lectureType,
  lectureTitle,
  initialContent,
  onSave,
}: LectureContentModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);

  // Video state
  const [videoContent, setVideoContent] = useState<VideoContent>(
    initialContent?.video || {},
  );
  const [isUploading, setIsUploading] = useState(false);

  // Quiz state
  const [quizContent, setQuizContent] = useState<QuizContent>(
    initialContent?.quiz || {
      title: "",
      description: "",
      questions: [],
      passingScore: 70,
    },
  );

  // Coding exercise state
  const [codingContent, setCodingContent] = useState<CodingExerciseContent>(
    initialContent?.coding || {
      title: "",
      description: "",
      language: "javascript",
      starterCode: "",
      solutionCode: "",
      testCases: [],
      hints: [],
    },
  );

  // Assignment state
  const [assignmentContent, setAssignmentContent] = useState<AssignmentContent>(
    initialContent?.assignment || {
      title: "",
      instructions: "",
      attachments: [],
      estimatedTime: "",
    },
  );

  // Resources state
  const [resources, setResources] = useState<
    { name: string; type: string; url?: string; file?: File }[]
  >(initialContent?.resources || []);

  // Description state
  const [description, setDescription] = useState(
    initialContent?.description || "",
  );

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    setVideoContent({
      file,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadProgress: 0,
    });

    try {
      const sigRes = await axiosClient.get(
        "/cloudinary-signature?folder=courses/lectures/videos",
      );
      const sigData = sigRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp);
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);
      formData.append("resource_type", "video");

      const res = await axios.post<CloudinaryUploadResponse>(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`,
        formData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / (e.total || 1));
            setVideoContent((prev) => ({ ...prev, uploadProgress: percent }));
          },
        },
      );

      setVideoContent((prev) => ({
        ...prev,
        uploadProgress: 100,
        isUploaded: true,
        url: res.data.secure_url,
        duration: minutesToSeconds(res.data.duration),
      }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Video upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleResourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newResources = Array.from(files).map((file) => ({
        name: file.name,
        type: file.type.includes("pdf")
          ? "PDF"
          : file.type.includes("image")
            ? "Image"
            : "File",
        file,
      }));
      setResources([...resources, ...newResources]);
    }
  };

  const addQuizQuestion = () => {
    setQuizContent({
      ...quizContent,
      questions: [
        ...quizContent.questions,
        {
          id: generateId(),
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        },
      ],
    });
  };

  const updateQuizQuestion = (
    questionId: string,
    updates: Partial<QuizQuestion>,
  ) => {
    setQuizContent({
      ...quizContent,
      questions: quizContent.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q,
      ),
    });
  };

  const deleteQuizQuestion = (questionId: string) => {
    setQuizContent({
      ...quizContent,
      questions: quizContent.questions.filter((q) => q.id !== questionId),
    });
  };

  const addTestCase = () => {
    setCodingContent({
      ...codingContent,
      testCases: [
        ...codingContent.testCases,
        { input: "", expectedOutput: "" },
      ],
    });
  };

  const handleSave = () => {
    const content: LectureContent = {
      description,
      resources,
    };

    if (lectureType === LectureType.VIDEO) {
      content.video = videoContent;
    } else if (lectureType === LectureType.QUIZ) {
      content.quiz = quizContent;
    } else if (lectureType === LectureType.CODING) {
      content.coding = codingContent;
    } else if (lectureType === LectureType.ASSIGNMENT) {
      content.assignment = assignmentContent;
    }

    onSave(content);
    onClose();
  };

  const renderVideoContent = () => (
    <div className="space-y-6">
      {/* Video Upload Area */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Video</Label>
        {videoContent.isUploaded ? (
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="h-16 w-24 bg-background rounded-lg flex items-center justify-center border border-border">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {videoContent.fileName}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span>{videoContent.fileSize}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {videoContent.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 text-green-500"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVideoContent({})}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : isUploading ? (
          <div className="border border-border rounded-lg p-6 bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {videoContent.fileName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Uploading... {Math.round(videoContent.uploadProgress || 0)}%
                </p>
                <Progress
                  value={videoContent.uploadProgress}
                  className="mt-2 h-2"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsUploading(false);
                  setVideoContent({});
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30"
          >
            <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="font-medium text-foreground mb-1">
              Drag and drop a video, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              MP4, WebM, or MOV • Max 4GB
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />
      </div>

      {/* Video Description */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Description</Label>
        <Textarea
          placeholder="Add a description for this lecture"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px] bg-background border-border"
        />
      </div>
    </div>
  );

  const renderQuizContent = () => (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Quiz Title</Label>
          <Input
            placeholder="Enter quiz title"
            value={quizContent.title}
            onChange={(e) =>
              setQuizContent({ ...quizContent, title: e.target.value })
            }
            className="bg-background border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Passing Score (%)</Label>
          <Input
            type="number"
            placeholder="70"
            value={quizContent.passingScore}
            onChange={(e) =>
              setQuizContent({
                ...quizContent,
                passingScore: parseInt(e.target.value),
              })
            }
            className="bg-background border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description (Optional)</Label>
        <Textarea
          placeholder="Brief description of the quiz"
          value={quizContent.description}
          onChange={(e) =>
            setQuizContent({ ...quizContent, description: e.target.value })
          }
          className="bg-background border-border"
        />
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">
            Questions ({quizContent.questions.length})
          </Label>
          <Button variant="outline" size="sm" onClick={addQuizQuestion}>
            <Plus className="h-4 w-4 mr-1" />
            Add Question
          </Button>
        </div>

        <AnimatePresence mode="popLayout">
          {quizContent.questions.map((question, qIndex) => (
            <motion.div
              key={question.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border border-border rounded-lg p-4 bg-muted/30 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <span className="font-semibold text-foreground">
                    Q{qIndex + 1}
                  </span>
                </div>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Enter your question"
                    value={question.question}
                    onChange={(e) =>
                      updateQuizQuestion(question.id, {
                        question: e.target.value,
                      })
                    }
                    className="bg-background border-border"
                  />
                  <RadioGroup
                    value={question.correctAnswer.toString()}
                    onValueChange={(val) =>
                      updateQuizQuestion(question.id, {
                        correctAnswer: parseInt(val),
                      })
                    }
                  >
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={optIndex.toString()}
                          id={`${question.id}-opt-${optIndex}`}
                        />
                        <Input
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[optIndex] = e.target.value;
                            updateQuizQuestion(question.id, {
                              options: newOptions,
                            });
                          }}
                          className="flex-1 bg-background border-border h-9"
                        />
                        {question.correctAnswer === optIndex && (
                          <Badge
                            variant="secondary"
                            className="bg-green-500/10 text-green-500"
                          >
                            Correct
                          </Badge>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Explanation (shown after answer)
                    </Label>
                    <Textarea
                      placeholder="Explain the correct answer..."
                      value={question.explanation}
                      onChange={(e) =>
                        updateQuizQuestion(question.id, {
                          explanation: e.target.value,
                        })
                      }
                      className="bg-background border-border min-h-[60px]"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteQuizQuestion(question.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {quizContent.questions.length === 0 && (
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium text-foreground">No questions yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Add questions to create your quiz
            </p>
            <Button variant="outline" onClick={addQuizQuestion}>
              <Plus className="h-4 w-4 mr-1" />
              Add First Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCodingContent = () => (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Exercise Title</Label>
          <Input
            placeholder="Enter exercise title"
            value={codingContent.title}
            onChange={(e) =>
              setCodingContent({ ...codingContent, title: e.target.value })
            }
            className="bg-background border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Programming Language</Label>
          <select
            value={codingContent.language}
            onChange={(e) =>
              setCodingContent({ ...codingContent, language: e.target.value })
            }
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="typescript">TypeScript</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Problem Description</Label>
        <Textarea
          placeholder="Describe the problem students need to solve..."
          value={codingContent.description}
          onChange={(e) =>
            setCodingContent({ ...codingContent, description: e.target.value })
          }
          className="bg-background border-border min-h-[100px]"
        />
      </div>

      <Tabs defaultValue="starter" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50">
          <TabsTrigger value="starter">Starter Code</TabsTrigger>
          <TabsTrigger value="solution">Solution</TabsTrigger>
          <TabsTrigger value="tests">Test Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="starter" className="mt-4">
          <div className="space-y-2">
            <Label>Starter Code</Label>
            <Textarea
              placeholder="// Code that students will start with"
              value={codingContent.starterCode}
              onChange={(e) =>
                setCodingContent({
                  ...codingContent,
                  starterCode: e.target.value,
                })
              }
              className="bg-background border-border min-h-[200px] font-mono text-sm"
            />
          </div>
        </TabsContent>

        <TabsContent value="solution" className="mt-4">
          <div className="space-y-2">
            <Label>Solution Code</Label>
            <Textarea
              placeholder="// The correct solution"
              value={codingContent.solutionCode}
              onChange={(e) =>
                setCodingContent({
                  ...codingContent,
                  solutionCode: e.target.value,
                })
              }
              className="bg-background border-border min-h-[200px] font-mono text-sm"
            />
          </div>
        </TabsContent>

        <TabsContent value="tests" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label>Test Cases</Label>
            <Button variant="outline" size="sm" onClick={addTestCase}>
              <Plus className="h-4 w-4 mr-1" />
              Add Test Case
            </Button>
          </div>
          {codingContent.testCases.map((test, index) => (
            <div
              key={index}
              className="grid gap-4 sm:grid-cols-2 border border-border rounded-lg p-3 bg-muted/30"
            >
              <div className="space-y-2">
                <Label className="text-sm">Input</Label>
                <Input
                  placeholder="Input value"
                  value={test.input}
                  onChange={(e) => {
                    const newTests = [...codingContent.testCases];
                    newTests[index].input = e.target.value;
                    setCodingContent({ ...codingContent, testCases: newTests });
                  }}
                  className="bg-background border-border font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Expected Output</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Expected output"
                    value={test.expectedOutput}
                    onChange={(e) => {
                      const newTests = [...codingContent.testCases];
                      newTests[index].expectedOutput = e.target.value;
                      setCodingContent({
                        ...codingContent,
                        testCases: newTests,
                      });
                    }}
                    className="flex-1 bg-background border-border font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCodingContent({
                        ...codingContent,
                        testCases: codingContent.testCases.filter(
                          (_, i) => i !== index,
                        ),
                      });
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {codingContent.testCases.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No test cases added yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderAssignmentContent = () => (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Assignment Title</Label>
          <Input
            placeholder="Enter assignment title"
            value={assignmentContent.title}
            onChange={(e) =>
              setAssignmentContent({
                ...assignmentContent,
                title: e.target.value,
              })
            }
            className="bg-background border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Estimated Time</Label>
          <Input
            placeholder="e.g., 2 hours"
            value={assignmentContent.estimatedTime}
            onChange={(e) =>
              setAssignmentContent({
                ...assignmentContent,
                estimatedTime: e.target.value,
              })
            }
            className="bg-background border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Instructions</Label>
        <Textarea
          placeholder="Provide detailed instructions for the assignment..."
          value={assignmentContent.instructions}
          onChange={(e) =>
            setAssignmentContent({
              ...assignmentContent,
              instructions: e.target.value,
            })
          }
          className="bg-background border-border min-h-[200px]"
        />
      </div>

      {/* Assignment Files */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Attachments</Label>
        {assignmentContent.attachments &&
          assignmentContent.attachments.length > 0 && (
            <div className="space-y-2">
              {assignmentContent.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30"
                >
                  <File className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setAssignmentContent({
                        ...assignmentContent,
                        attachments: assignmentContent.attachments?.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        <div
          onClick={() => resourceInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30"
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-foreground">
            Upload starter files or resources
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, ZIP, or any document
          </p>
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-4 pt-6 border-t border-border">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">
            Downloadable Resources
          </Label>
          <p className="text-sm text-muted-foreground">
            Add supplementary materials for this lecture
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => resourceInputRef.current?.click()}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Resource
        </Button>
      </div>

      {resources.length > 0 && (
        <div className="space-y-2">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30"
            >
              <File className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {resource.name}
                </p>
                <p className="text-xs text-muted-foreground">{resource.type}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setResources(resources.filter((_, i) => i !== index))
                }
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={resourceInputRef}
        type="file"
        multiple
        onChange={handleResourceUpload}
        className="hidden"
      />
    </div>
  );

  const getModalTitle = () => {
    switch (lectureType) {
      case LectureType.VIDEO:
        return "Add Lecture Content";

      case LectureType.QUIZ:
        return "Create Quiz";

      case LectureType.CODING:
        return "Create Coding Exercise";

      case LectureType.ASSIGNMENT:
        return "Create Assignment";

      case LectureType.TEXT:
      default:
        return "Add Content";
    }
  };

  const getModalIcon = () => {
    switch (lectureType) {
      case LectureType.VIDEO:
        return <Video className="h-5 w-5" />;

      case LectureType.QUIZ:
        return <HelpCircle className="h-5 w-5" />;

      case LectureType.CODING:
        return <Code className="h-5 w-5" />;

      case LectureType.ASSIGNMENT:
        return <BookOpen className="h-5 w-5" />;

      case LectureType.TEXT:
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogContent className="  overflow-hidden"> */}
      <DialogContent className="max-w-3xl! max-h-[90vh] rounded-2xl overflow-hidden p-0">
        <DialogHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {getModalIcon()}
            </div>
            <div>
              <p className="text-lg font-semibold">{getModalTitle()}</p>
              <p className="text-sm font-normal text-muted-foreground">
                {lectureTitle || "Untitled Lecture"}
              </p>
            </div>
          </DialogTitle>

          {/* CLOSE BUTTON */}
          <DialogClose asChild>
            <button className="rounded-md p-2 hover:bg-muted transition">
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* SCROLLABLE BODY */}
        <div className="h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* {lectureType === "video" && renderVideoContent()}
          {lectureType === "quiz" && renderQuizContent()}
          {lectureType === "coding" && renderCodingContent()}
          {lectureType === "assignment" && renderAssignmentContent()}

          {lectureType !== "quiz" && renderResources()} */}
          {lectureType === LectureType.VIDEO && renderVideoContent()}
          {lectureType === LectureType.QUIZ && renderQuizContent()}
          {lectureType === LectureType.CODING && renderCodingContent()}
          {lectureType === LectureType.ASSIGNMENT && renderAssignmentContent()}

          {lectureType !== LectureType.QUIZ && renderResources()}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Content</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
