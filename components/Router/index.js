import styled from "styled-components"

export const Route = styled.div`
  ${({ invisible }) => invisible ? 'display: none;' : ''}
`

export default ({ route, children }) => {
  return children.map(child => {
    if (route === child.props.slug) return child
   return {...child, props: { ...child.props, invisible: true }}
  })
}
