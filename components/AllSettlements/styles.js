import styled from 'styled-components'
import TisztaszavazasLogo from '../TisztaszavazasLogo';
import { PageHeader } from 'antd';

export const Wrap = styled.div`
  display: flex;
  flex-direction: ${({ horizontal }) => horizontal ? 'row' : 'column' };
`

export const MapWrap = styled.div`
  width: 100%;
`

export const PageHeaderStyled = styled(PageHeader)`
  padding: 16px 4px;
`

export const TisztaszavazasLogoStyled = styled(TisztaszavazasLogo).attrs({ width: 140 })``


export const DrawerFooter = styled.div`
  position: absolute;
  bottom: 0;
  background: white;
  width: 100%;
  padding: 10px;
  left: 0;
`

export const OevkSetter = styled.table`
  td, th {
    padding: 4px;
  }
  margin-bottom: 40px;
`

export const OevkButton = styled.button`
  cursor: pointer;
`

export const OevkTr = styled.tr`
  ${({ $highlighted }) => $highlighted ? `
    td {
      background: #838DA2;
    }
` : ``}
`

export const BottomInner = styled.div`
  display: flex;
  article {
    flex-direction: column;
    margin-right: 12px;
  }
`

export const WinnedWrap = styled.div`
  display: flex;
  > * {
    margin-right: 30px;
  }
`

export const VoterNumTd = styled.td`
  text-align: right;
`
