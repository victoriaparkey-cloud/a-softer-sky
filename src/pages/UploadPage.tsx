import { UploadZone } from '../components/UploadZone'
import { LoadingState } from '../components/LoadingState'
import { SkyReading } from '../components/SkyReading'
import { useSkyProcessor } from '../hooks/useSkyProcessor'

export function UploadPage() {
  const { state, process, reset } = useSkyProcessor()

  if (state.status === 'extracting') {
    return <LoadingState previewUrl={state.previewUrl} status="extracting" />
  }

  if (state.status === 'done' && state.entry) {
    return <SkyReading entry={state.entry} onNewSky={reset} />
  }

  return <UploadZone onFile={process} />
}
