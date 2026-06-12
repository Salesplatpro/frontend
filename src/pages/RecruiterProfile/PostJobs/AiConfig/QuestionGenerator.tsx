import React from 'react'
import { FaPlus } from 'react-icons/fa6'

type QuestionGeneratorProps = {
  pair: string
  generatedQuestion: string | null
  onGenerate: () => void
  onAddQuestion: () => void
  isLoading: boolean
}

const QuestionGenerator = ({
  pair,
  generatedQuestion,
  onGenerate,
  onAddQuestion,
  isLoading,
}: QuestionGeneratorProps) => (
  <div className="mb-4">
    <h3 className="font-semibold text-[14px] text-[#434144] mb-1">
      Dichotomy Pair {pair}
    </h3>
    <button
      type="button"
      onClick={onGenerate}
      className={`p-2 ${
        isLoading ? 'bg-gray-500' : 'bg-primary-strong'
      } text-white text-[14px] rounded mr-2`}
      disabled={isLoading}
    >
      {isLoading
        ? 'Loading...'
        : generatedQuestion
        ? `Regenerate ${pair}`
        : `Generate ${pair}`}
    </button>
    {generatedQuestion && (
      <div className="bg-white shadow-md p-4 rounded-lg my-3">
        <p>{generatedQuestion}</p>
        <button
          type="button"
          onClick={onAddQuestion}
          className="px-4 mt-2 py-2 bg-[#d7e8ff] text-info rounded-3xl"
        >
          <span className="flex items-center gap-2">
            <FaPlus /> Add {pair} Question
          </span>
        </button>
      </div>
    )}
  </div>
)

export default QuestionGenerator
