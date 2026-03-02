import { View, TouchableOpacity } from "react-native";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { useTheme } from "@/src/hooks/use-theme";
import Spacer from "@/src/components/Spacer";
import Divider from "@/src/components/Divider";
import { makeUpiPayment } from "@/src/utils/payment";
import ThemedButton from "@/src/components/ThemedButton";
import { useState } from "react";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";

type ClubDueType = {
  clubId: string;
  clubName: string;
  upiId: string;
  dueAmount: number;
  dues: {
    paymentId: string | number;
    feeType: string;
    fee: string;
    feeDesc: string;
    amount: number;
  }[];
};

const FeeSummary = (props: { duesByMember: ClubDueType[], isAllSelected?: boolean }) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate total dues across all clubs
  const totalDues = props.duesByMember?.reduce((sum, club) => sum + club.dueAmount, 0) || 0;

  if (props.duesByMember?.length == 0) {
    return (
      <ThemedView style={{ width: '85%', alignSelf: 'center' }}>
        <View style={{
          backgroundColor: colors.primary,
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <ThemedIcon name="MaterialIcons:check-circle" size={48} color="#4CAF50" />
          <Spacer space={8} />
          <ThemedText style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
            All Clear! 🎉
          </ThemedText>
          <Spacer space={4} />
          <ThemedText style={{ fontSize: 14, color: colors.subText, textAlign: 'center' }}>
            You have no pending dues
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // When "ALL" is selected, show cumulative view
  if (props.isAllSelected && props.duesByMember?.length > 1) {
    return (
      <ThemedView style={{ width: '85%', alignSelf: 'center' }}>
        {/* Cumulative Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsExpanded(!isExpanded)}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 16,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 14, color: colors.subText, marginBottom: 4 }}>
                Total Outstanding
              </ThemedText>
              <ThemedText style={{ fontSize: 32, fontWeight: 'bold', color: colors.text }}>
                ₹ {totalDues.toFixed(2)}
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.subText, marginTop: 4 }}>
                Across {props.duesByMember.length} club{props.duesByMember.length > 1 ? 's' : ''}
              </ThemedText>
            </View>
            <View style={{
              backgroundColor: colors.button,
              borderRadius: 12,
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <ThemedIcon 
                name={isExpanded ? "MaterialIcons:expand-less" : "MaterialIcons:expand-more"} 
                size={28} 
                color="white" 
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Expanded Split-up */}
        {isExpanded && (
          <>
            <Spacer space={12} />
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <ThemedText style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                marginBottom: 12,
                color: colors.text 
              }}>
                Club-wise Breakdown
              </ThemedText>
              {props.duesByMember.map((item, idx) => (
                <View key={item.clubId}>
                  {idx > 0 && <Divider />}
                  <Spacer space={8} />
                  <ClubDue club={item} isCompact={true} />
                  <Spacer space={8} />
                </View>
              ))}
            </View>
          </>
        )}
      </ThemedView>
    );
  }

  // Single club view or specific club selected
  return (
    <ThemedView style={{ width: '85%', alignSelf: 'center' }}>
      {props.duesByMember.map((item, idx) => (
        <View key={item.clubId}>
          {idx > 0 && <Spacer space={12} />}
          <ClubDue club={item} isCompact={false} />
        </View>
      ))}
    </ThemedView>
  );
};

export default FeeSummary;

const ClubDue = ({ club, isCompact }: { club: ClubDueType, isCompact?: boolean }) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  if (isCompact) {
    // Compact view for breakdown list
    return (
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 4,
      }}>
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontSize: 15, fontWeight: '500' }}>
            {club.clubName}
          </ThemedText>
          <ThemedText style={{ fontSize: 12, color: colors.subText, marginTop: 2 }}>
            {club.dues.length} pending item{club.dues.length > 1 ? 's' : ''}
          </ThemedText>
        </View>
        <ThemedText style={{ 
          fontSize: 18, 
          fontWeight: 'bold',
          color: colors.text 
        }}>
          ₹ {club.dueAmount.toFixed(2)}
        </ThemedText>
      </View>
    );
  }

  // Full detailed view for single club - similar to "All" view
  return (
    <View>
      {/* Main Club Total Card */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 16,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <ThemedText style={{ fontSize: 14, color: colors.subText, marginBottom: 4 }}>
              {club.clubName}
            </ThemedText>
            <ThemedText style={{ fontSize: 32, fontWeight: 'bold', color: colors.text }}>
              ₹ {club.dueAmount.toFixed(2)}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: colors.subText, marginTop: 4 }}>
              {club.dues.length} pending payment{club.dues.length > 1 ? 's' : ''}
            </ThemedText>
          </View>
          <View style={{
            backgroundColor: colors.button,
            borderRadius: 12,
            width: 48,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ThemedIcon 
              name={isExpanded ? "MaterialIcons:expand-less" : "MaterialIcons:expand-more"} 
              size={28} 
              color="white" 
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded Payment Breakdown */}
      {isExpanded && (
        <>
          <Spacer space={12} />
          <View style={{
            backgroundColor: colors.primary,
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}>
            <ThemedText style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              marginBottom: 12,
              color: colors.text 
            }}>
              Payment Details
            </ThemedText>
            {club.dues.map((due: any, idx: number) => (
              <View key={due.paymentId.toString() + due.feeType}>
                {idx > 0 && <Divider />}
                <Spacer space={8} />
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <ThemedText style={{ fontSize: 15, fontWeight: '500' }}>
                      {due.fee}
                    </ThemedText>
                    {due.feeDesc && (
                      <ThemedText style={{ 
                        fontSize: 13, 
                        color: colors.subText,
                        marginTop: 4,
                      }}>
                        {due.feeDesc}
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText style={{ 
                    fontSize: 16, 
                    fontWeight: '600',
                    color: colors.text 
                  }}>
                    ₹ {due.amount.toFixed(2)}
                  </ThemedText>
                </View>
                <Spacer space={8} />
              </View>
            ))}
            
            {club.upiId && (
              <>
                <Spacer space={8} />
                <ThemedButton 
                  onPress={() => makeUpiPayment(club.dueAmount, club.clubName, club.upiId)} 
                  title="Pay Now" 
                  icon="MaterialIcons:payment"
                />
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};
