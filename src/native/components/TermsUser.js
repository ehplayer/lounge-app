import React from 'react';
import {Container, Text} from 'native-base';
import {ScrollView, StyleSheet} from "react-native";

class TermsUser extends React.Component {
    render() {
        return (
            <Container>
                <ScrollView style={{backgroundColor: '#ffffff', padding:10}}>
                    <Text>정보통신망법 규정에 따라 MBA 라운지에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.</Text>
                    <Text style={styles.textHeader}>1. 수집하는 개인정보</Text>
                    <Text>이용자가 서비스를 이용하기 위해 회원가입을 할 경우, MBA 라운지는 서비스 이용을 위해 필요한 최소한의 개인정보를 수집합니다.</Text>
                    <Text style={styles.textHeader}>회원가입 시점에 MBA 라운지가 이용자로부터 수집하는 개인정보는 아래와 같습니다.</Text>
                    <Text>- 회원 가입 시에 ‘아이디, 비밀번호, 이름, 생년월일, 성별, 휴대폰번호, 이메일’을 필수항목으로 수집합니다</Text>
                    <Text>서비스 이용 과정에서 IP 주소, 쿠키, 서비스 이용 기록, 기기정보가 생성되어 수집될 수 있습니다.
                        구체적으로 1) 서비스 이용 과정에서 이용자에 관한 정보를 정보통신서비스 제공자가 자동화된 방법으로 생성하여 이를 저장(수집)하거나,  2) 이용자 기기의 고유한 정보를 원래의 값을 확인하지 못 하도록 안전하게 변환한 후에 수집하는 경우를 의미합니다.</Text>
                    <Text style={styles.textHeader}>2. 수집한 개인정보의 이용</Text>
                    <Text>MBA 라운지 서비스의 회원관리, 서비스 개발・제공 및 향상, 안전한 인터넷 이용환경 구축 등 아래의 목적으로만 개인정보를 이용합니다.</Text>
                    <Text>- 회원 가입 의사의 확인, 이용자의 본인 확인, 이용자 식별, 회원탈퇴 의사의 확인 등 회원관리를 위하여 개인정보를 이용합니다</Text>
                    <Text>- 콘텐츠 등 기존 서비스 제공(광고 포함)에 더하여, 인구통계학적 분석, 서비스 방문 및 이용기록의 분석, 개인정보 및 관심에 기반한 이용자간 관계의 형성, 지인 및 관심사 등에 기반한 맞춤형 서비스 제공 등 신규 서비스 요소의 발굴 및 기존 서비스 개선 등을 위하여 개인정보를 이용합니다.</Text>
                    <Text>- 법령 및 MBA 라운지 이용약관을 위반하는 회원에 대한 이용 제한 조치, 부정 이용 행위를 포함하여 서비스의 원활한 운영에 지장을 주는 행위에 대한 방지 및 제재, 계정도용 및 부정거래 방지, 약관 개정 등의 고지사항 전달, 분쟁조정을 위한 기록 보존, 민원처리 등 이용자 보호 및 서비스 운영을 위하여 개인정보를 이용합니다.</Text>
                    <Text>- 유료 서비스 제공에 따르는 본인인증, 구매 및 요금 결제, 상품 및 서비스의 배송을 위하여 개인정보를 이용합니다.</Text>
                    <Text>- 이벤트 정보 및 참여기회 제공, 광고성 정보 제공 등 마케팅 및 프로모션 목적으로 개인정보를 이용합니다.</Text>
                    <Text>- 서비스 이용기록과 접속 빈도 분석, 서비스 이용에 대한 통계, 서비스 분석 및 통계에 따른 맞춤 서비스 제공 및 광고 게재 등에 개인정보를 이용합니다.</Text>
                    <Text>- 보안, 프라이버시, 안전 측면에서 이용자가 안심하고 이용할 수 있는 서비스 이용환경 구축을 위해 개인정보를 이용합니다.</Text>
                    <Text style={styles.textHeader}>3. 개인정보의 파기</Text>
                    <Text style={styles.textHeader}>회사는 원칙적으로 이용자의 개인정보를 회원 탈퇴 시 파기하고 있습니다.</Text>
                    <Text>단, 처리 작업에 따른 일정 기간은 소요될 수 있으며 법령에서 일정 기간 정보보관 의무를 부과하는 경우에는 해당 기간 동안 개인정보를 안전하게 보관합니다.</Text>
                    <Text>통신비밀보호법에서 일정기간 정보의 보관을 규정하는 경우는 아래와 같습니다. MBA 라운지는 이 기간 동안 법령의 규정에 따라 개인정보를 보관하며, 본 정보를 다른 목적으로는 절대 이용하지 않습니다.</Text>
                    <Text>- 통신비밀보호법 </Text>
                    <Text>로그인 기록: 3개월</Text>
                </ScrollView>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    textHeader:{
        fontWeight:'bold', fontSize:15, marginBottom:10, marginTop:10
    },
});

export default TermsUser;