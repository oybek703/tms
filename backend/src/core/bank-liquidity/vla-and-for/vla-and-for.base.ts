import { Base } from '../../base'

export class VlaAndForBase extends Base {
  protected formatQuery(whereQuery: string): string {
    return `SELECT * FROM DUAL`
  }

  async getRows() {
    return ['data from vla and for']
  }
}
