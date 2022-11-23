import { Base } from '../../base'

export class CaaBase extends Base {
  protected formatQuery(whereQuery: string): string {
    return ''
  }

  async getRows() {
    return ['CAA BASE']
  }
}
