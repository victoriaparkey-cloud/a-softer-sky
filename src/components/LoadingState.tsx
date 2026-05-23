interface LoadingStateProps {
  previewUrl: string | null
  status: 'extracting'
}

const messages = {
  extracting: 'Reading the sky…',
}

export function LoadingState({ previewUrl, status }: LoadingStateProps) {
  return (
    <div className="page-enter">
      {/* Full-bleed preview */}
      {previewUrl && (
        <div className="w-full" style={{ maxHeight: '55vh', overflow: 'hidden' }}>
          <img
            src={previewUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ maxHeight: '55vh' }}
          />
        </div>
      )}

      {/* Loading indicator */}
      <div className="text-center py-12 px-7">
        <div className="loading-bar mb-5" />
        <p className="label-caps">{messages[status]}</p>
      </div>
    </div>
  )
}
