export type ProviderType = {
    ActiveProvider: boolean
    // following two items are deprecated
    MinDate: string
    MaxDate: string
    MonthlyCounts: Array<MonthlyCountType>
    PlatformCount?: string
    PlatformCounts: Array<PlatformCountType>
    Provider: string
    TotalSoundings: number
    FirstCollection: string
    LastCollection: string
    FirstSubmission: string
    LastSubmission: string
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
    FirstCollection: string
    LastCollection: string
    UniqueId: string
    
}

export type ProvidersType = {
    report_date: string
    providers: Array<ProviderType>
}