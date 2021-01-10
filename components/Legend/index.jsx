import styled from "styled-components"

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

const LegendSquare = styled.div`
  margin-right: 12px;
  width: 20px;
  height: 20px;
  display: inline-block;
  ${({ stroke, fill }) => `
    border: 4px solid ${stroke};
    background-color: ${fill};
  `}
`

const Legend = ({ stroke, fill, text }) => {
  return (
    <Wrapper>
      <LegendSquare
        stroke={stroke}
        fill={fill}
      />
      <div>
        {text}
      </div>
    </Wrapper>
  )
}

export default Legend
