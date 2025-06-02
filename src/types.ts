export type ProviderType = {
    ActiveProvider: boolean
    MinDate: string
    MaxDate: string
    MonthlyCounts: Array<MonthlyCountType>
    PlatformCount?: string
    PlatformCounts: Array<PlatformCountType>
    Provider: string
    TotalSoundings: number
}

export type MonthlyCountType = {
    Month: string
    Count: number
}

export type PlatformCountType = {
    Platform: string
    Count: number
    FirstSubmission: string
    LastSubmission: string
    
}

export type ProvidersType = {
    report_date: string
    providers: Array<ProviderType>
}