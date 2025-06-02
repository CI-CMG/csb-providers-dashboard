import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/about')({
  component: About,
  loader: ({context}) => {
    console.log(context.providerData.report_date)
  }
})

function About() {
  return <div className="p-2">Hello from About!</div>
}