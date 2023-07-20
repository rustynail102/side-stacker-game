export class DateService {
  static convertUnixTimestampToDate = (unixTimestamp: number) =>
    new Date(unixTimestamp).toISOString()

  static currentDateAsUnixTimestamp = () => new Date().getTime()
}
