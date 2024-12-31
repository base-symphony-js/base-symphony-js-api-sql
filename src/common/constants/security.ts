type Actions = 'read' | 'add' | 'edit' | 'delete'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface MethodAction {
  method: HttpMethod
  action: Actions
}

export const METHOD_ACTIONS: MethodAction[] = [
  {
    method: 'GET',
    action: 'read',
  },
  {
    method: 'POST',
    action: 'add',
  },
  {
    method: 'PUT',
    action: 'edit',
  },
  {
    method: 'PATCH',
    action: 'edit',
  },
  {
    method: 'DELETE',
    action: 'delete',
  },
]
