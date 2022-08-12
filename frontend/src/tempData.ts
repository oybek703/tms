export enum Status {
  none,
  safe,
  warn,
  danger
}

function getEmptyBankData() {
  return { value: '', status: Status.none }
}

function getStatus(percent: number) {
  if (percent >= 0 && percent <= 85) return Status.safe
  if (percent > 85 && percent < 95) return Status.warn
  if (percent >= 95) return Status.danger
  return Status.none
}

function getMinBankData(mainBankValue: number, bankValue: number) {
  let status: Status = Status.none
  const percent = Number((bankValue * 100 / mainBankValue).toFixed(2))
  status = getStatus(percent)
  return {
    value: `мин ${bankValue}%`,
    status
  }
}

function getMaxBankData(mainBankValue: number, bankValue: number) {
  let status: Status = Status.none
  const percent = Number((mainBankValue * 100 / bankValue).toFixed(2))
  status = getStatus(percent)
  return {
    value: `мах ${bankValue}%`,
    status
  }
}

function getPureBankData(pureValue: string = '', status: Status) {
  return {
    value: pureValue,
    status
  }
}

export const covenantData = [
  {
    title: 'Коэффициенты достаточности капитала',
    main_bank: 14.24,
    bank_1: getMinBankData(14.24, 10),
    bank_2: getEmptyBankData(),
    // bank_3: getMinBankData(14.24, 13),
    bank_3: getEmptyBankData(),
    bank_4: getMinBankData(14.24, 13),
    bank_5: getMinBankData(14.24, 13),
    bank_6: getMinBankData(14.24, 13),
    bank_7: getMinBankData(14.24, 14),
    bank_8: getMinBankData(14.24, 13)
  },
  {
    title: 'Коэффициенты достаточности капитала уровня I',
    main_bank: 13.03,
    bank_1: getMinBankData(13.03, 7.5),
    bank_2: getEmptyBankData(),
    // bank_3: getMinBankData(13.03, 11),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getMinBankData(13.03, 10),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Коэффициент не действующих активов (NPL) МСФО',
    main_bank: 4.8,
    bank_1: getMaxBankData(4.8, 5),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: `Правительству Республики Узбекистан 
    прямо или косвенно должно принадлежать 
    не менее 80% установного капитала Заемщика. (МСФО)`,
    main_bank: 97.15,
    bank_1: getEmptyBankData(),
    bank_2: getMinBankData(97.15, 80),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Коэффициент не действующих активов (NPL) НСБУ',
    main_bank: 4.83,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getMaxBankData(4.83, 5),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Процент резерва на возможные потери по ссудам и лизингу по проблемным ссудам',
    main_bank: 178.4,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getMinBankData(178.4, 100),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Соотношение расходов и доходов',
    main_bank: 68.59,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getMaxBankData(68.59, 75),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Соотношение среднего показателя доходности активов (ROA)',
    main_bank: 0.09,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getMinBankData(0.09, 1),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Чистая доля проблемной задолженности в общем объеме выданных кредитов (NPL) НСБУ',
    main_bank: 2.85,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getMaxBankData(2.85, 5),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Максимальный предел по индивидуальному размеру риска на группу связанных заёмщиков',
    main_bank: 3.36,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getMaxBankData(3.36, 25),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Левераж',
    main_bank: 9.82,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getMinBankData(9.82, 6),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Коэффициент открытого кредитного риска',
    main_bank: 12.72,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getMaxBankData(12.72, 20),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Коэффициент ликвидности',
    main_bank: 161,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getMinBankData(161, 50),
    bank_8: getEmptyBankData()
  },
  {
    title: `Максимальный размер риска на одного заемщика или группу взаимосвязанных заемщиков / 
  Регулятивный капитал (согласно контракту 20% при этом, 
  получено письмо об
   изменении требования до 26% до 31.12.2022г).`,
    main_bank: 19.14,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getMaxBankData(19.14, 20),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Максимальный размер риска для всех крупных активов / Регулятивный капитал',
    main_bank: 376.41,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getMaxBankData(376.41, 800),
    bank_8: getEmptyBankData()
  },
  {
    title: `Выданные кредиты (не включая государственных гарантий обеспеченных Правительством 
  Узбекистан) компании UzAutoMotors не превышает 65% регулятивного капитала до 01.01.2021. 
  (согласно контракту 20% при этом, 
  получено письмо об изменении требования до 55% до 31.12.2021г).`,
    main_bank: 50.24,
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getMaxBankData(50.24, 55),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Чистый доход за последные два года',
    main_bank: 'в соответствии',
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getPureBankData('больше чем 0', Status.safe),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Чистый доход за текущий год',
    main_bank: 'в соответствии',
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getPureBankData('больше чем 0', Status.safe),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Соблюдение всем требованиям ЦБРУз',
    main_bank: 'в соответствии',
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Квартальные совокупные финансовые результаты после налогообложения и корректировки',
    main_bank: 'в соответствии',
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getPureBankData('больше чем 0', Status.safe),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Кредитный рейтинг',
    main_bank: 'B1',
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getPureBankData('мин B2', Status.safe),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getEmptyBankData()
  },
  {
    title: 'Собственный капитал',
    main_bank: '6.2 трлн.сум',
    bank_1: getEmptyBankData(),
    bank_2: getEmptyBankData(),
    // bank_3: getEmptyBankData(),
    bank_3: getEmptyBankData(),
    bank_4: getEmptyBankData(),
    bank_5: getEmptyBankData(),
    bank_6: getEmptyBankData(),
    bank_7: getEmptyBankData(),
    bank_8: getPureBankData('мин 6.2 трлн.сум', Status.safe)
  }
]
