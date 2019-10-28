import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

export async function withSuccessResponse(request: () => {}, response: any) {
  const mock = new MockAdapter(axios)
  mock.onAny().reply(200, response)

  // TODO: remove unecessary await?
  return await request()
}
