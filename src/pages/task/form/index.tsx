import { useSearchParams } from 'umi';
import TaskFormWizard, { type TaskFormMode } from '@/components/TaskFormWizard';

export default function TaskFormPage() {
  const [params] = useSearchParams();
  const modeParam = params.get('mode') || 'create';
  const mode: TaskFormMode =
    modeParam === 'edit' || modeParam === 'detail' ? modeParam : 'create';
  const id = params.get('id') || undefined;

  return <TaskFormWizard mode={mode} taskId={id} />;
}
