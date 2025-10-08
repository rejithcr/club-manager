import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { BirthdayMember } from '@/src/types/member';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import { useTheme } from '@/src/hooks/use-theme';
import Card from '@/src/components/Card';

interface BirthdayCardProps {
  member: BirthdayMember;
  onPress?: () => void;
  layout?: 'card' | 'list'; // New prop for layout type
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ member, onPress, layout = 'card' }) => {
  const { colors } = useTheme();

  const getDaysText = (days: number) => {
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow';
    if (days < 0) {
      const absDays = Math.abs(days);
      return absDays === 1 ? 'Yesterday' : `${absDays} days ago`;
    }
    return `${days} days`;
  };

  const getBirthdayColor = (days: number) => {
    if (days === 0) return colors.success; // Today - green
    if (days === 1) return '#90EE90'; // Tomorrow - light green (CSS light green)
    if (days < 0) return colors.error; // Previous week - red
    if (days <= 7) return colors.warning; // This week - warning color
    return colors.subText; // Future - subtle color
  };

  if (layout === 'list') {
    // Compact horizontal layout for the unified feed
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingVertical: 8,
          borderLeftWidth: 4,
          borderLeftColor: getBirthdayColor(member.daysUntilBirthday),
          paddingLeft: 12
        }}>
          {member.photo ? (
            <Image 
              source={{ uri: member.photo }} 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                marginRight: 12 
              }} 
            />
          ) : (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}>
              <ThemedText style={{ 
                color: colors.background, 
                fontWeight: 'bold',
                fontSize: 16
              }}>
                {member.firstName.charAt(0)}{member.lastName.charAt(0)}
              </ThemedText>
            </View>
          )}
          
          <View style={{ flex: 1, marginRight: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <ThemedText style={{ fontWeight: 'bold', fontSize: 14, flex: 1 }} numberOfLines={1}>
                {member.firstName} {member.lastName}
              </ThemedText>
              {member.clubCount > 1 && (
                <View style={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  marginLeft: 4
                }}>
                  <ThemedText style={{ 
                    color: colors.background, 
                    fontSize: 9,
                    fontWeight: 'bold'
                  }}>
                    {member.clubCount}
                  </ThemedText>
                </View>
              )}
            </View>
            <ThemedText style={{ fontSize: 11, color: colors.subText }} numberOfLines={1}>
              {member.clubNames}
            </ThemedText>
          </View>
          
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedIcon 
                name="MaterialCommunityIcons:cake-variant" 
                size={14} 
                color={getBirthdayColor(member.daysUntilBirthday)} 
              />
              <ThemedText style={{ 
                marginLeft: 4, 
                fontSize: 11,
                color: getBirthdayColor(member.daysUntilBirthday),
                fontWeight: 'bold'
              }}>
                {getDaysText(member.daysUntilBirthday)}
              </ThemedText>
            </View>
            <ThemedText style={{ 
              fontSize: 10, 
              color: colors.subText,
              marginTop: 2
            }}>
              {new Date(member.dateOfBirth).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Original card layout for standalone use
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={{ 
        width: 240, 
        backgroundColor: colors.background,
        borderLeftWidth: 4,
        borderLeftColor: getBirthdayColor(member.daysUntilBirthday)
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              {member.photo ? (
                <Image 
                  source={{ uri: member.photo }} 
                  style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 20, 
                    marginRight: 10 
                  }} 
                />
              ) : (
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10
                }}>
                  <ThemedText style={{ 
                    color: colors.background, 
                    fontWeight: 'bold',
                    fontSize: 16
                  }}>
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </ThemedText>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ThemedText style={{ fontWeight: 'bold', fontSize: 14, flex: 1 }} numberOfLines={1}>
                    {member.firstName} {member.lastName}
                  </ThemedText>
                  {member.clubCount > 1 && (
                    <View style={{
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      marginLeft: 4
                    }}>
                      <ThemedText style={{ 
                        color: colors.subText, 
                        fontSize: 10,
                        fontWeight: 'bold'
                      }}>
                        {member.clubCount}
                      </ThemedText>
                    </View>
                  )}
                </View>
                <ThemedText style={{ fontSize: 12, color: colors.subText }} numberOfLines={1}>
                  {member.clubCount > 1 
                    ? member.clubNames
                    : member.clubNames
                  }
                </ThemedText>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedIcon 
                  name="MaterialCommunityIcons:cake-variant" 
                  size={16} 
                  color={getBirthdayColor(member.daysUntilBirthday)} 
                />
                <ThemedText style={{ 
                  marginLeft: 4, 
                  fontSize: 12,
                  color: getBirthdayColor(member.daysUntilBirthday),
                  fontWeight: 'bold'
                }}>
                  {getDaysText(member.daysUntilBirthday)}
                </ThemedText>
              </View>
              
              <ThemedText style={{ 
                fontSize: 12, 
                color: colors.subText 
              }}>
                {new Date(member.dateOfBirth).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </ThemedText>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default BirthdayCard;