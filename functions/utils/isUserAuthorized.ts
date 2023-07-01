// const { uniq } = require('lodash')

// const MEMBER_ROLE = 'member'
// const VIEWER_ROLE = 'viewer'
// const EDITOR_ROLE = 'editor'
// const ADMIN_ROLE = 'admin'
// const SUPERADMIN_ROLE = 'superadmin'

// type UserRole =
//   | typeof MEMBER_ROLE
//   | typeof VIEWER_ROLE
//   | typeof EDITOR_ROLE
//   | typeof ADMIN_ROLE
//   | typeof SUPERADMIN_ROLE

// const isUserAuthorized = (meRole: UserRole, requiredRole: UserRole) => {
//   switch (requiredRole) {
//     case VIEWER_ROLE:
//       return (
//         meRole === VIEWER_ROLE ||
//         meRole === EDITOR_ROLE ||
//         meRole === ADMIN_ROLE ||
//         meRole === SUPERADMIN_ROLE
//       )
//     case EDITOR_ROLE:
//       return (
//         meRole === EDITOR_ROLE ||
//         meRole === ADMIN_ROLE ||
//         meRole === SUPERADMIN_ROLE
//       )
//     case ADMIN_ROLE:
//       return meRole === ADMIN_ROLE || meRole === SUPERADMIN_ROLE
//     case SUPERADMIN_ROLE:
//       return meRole === SUPERADMIN_ROLE
//     // 'member' is the default role and has no authorization for anything currently
//     case MEMBER_ROLE:
//     default:
//       return false
//   }
// }

// const meRole = EDITOR_ROLE
// const requiredRole = VIEWER_ROLE
// console.log(isUserAuthorized(meRole, requiredRole))

const BINGO_REWARD_ZERO_LINE = '0'
const BINGO_REWARD_ONE_LINE = '1'
const BINGO_REWARD_THREE_LINE = '3'
const BINGO_REWARD_EIGHT_LINE = '8'

type BingoRewardLine =
  | typeof BINGO_REWARD_ZERO_LINE
  | typeof BINGO_REWARD_ONE_LINE
  | typeof BINGO_REWARD_THREE_LINE
  | typeof BINGO_REWARD_EIGHT_LINE

// const completedLineCount = 2
const rewardCount = {
  limit1: 1,
  limit3: 1,
  limit8: 1,
}

interface RewardCount {
  limit1: number
  limit3: number
  limit8: number
}

type RewardCountKey = keyof RewardCount

const bingoValidator = (
  completedLineCount: number,
  rewardCount: RewardCount
): [BingoRewardLine, string[]] => {
  let bingoReward: BingoRewardLine = '0'
  // let disableVaues: string[] = []

  const rewardCountKeys = Object.keys(rewardCount) as RewardCountKey[]

  // 1단계: 완성 줄 수 별 타입지정
  if (completedLineCount <= 2) {
    bingoReward = BINGO_REWARD_ONE_LINE
  } else if (completedLineCount > 2 && completedLineCount < 8) {
    bingoReward = BINGO_REWARD_THREE_LINE
  } else if (completedLineCount === 8) {
    bingoReward = BINGO_REWARD_EIGHT_LINE
  } else {
    bingoReward = BINGO_REWARD_ZERO_LINE
  }

  // 2단계: 보상 제한 조건에 따른 타입 변경
  for (let i = 0; i < rewardCountKeys.length; i++) {
    const rewardCountKey = rewardCountKeys[i]
    const rewardCountValue = rewardCount[rewardCountKey]

    // 모든 보상이 0이면 모든 보상 비활성화
    if (rewardCountValue === 0) {
      // 한줄 보상횟수가 0인 경우
      if (
        bingoReward === BINGO_REWARD_ONE_LINE &&
        rewardCountKey === 'limit1'
      ) {
        bingoReward = BINGO_REWARD_ZERO_LINE
      } else if (rewardCountKey === 'limit3') {
        // 3줄 완성했지만 3줄 보상제한, 하위 1줄 보상횟수 있는 경우
        if (
          bingoReward === BINGO_REWARD_THREE_LINE &&
          rewardCount.limit3 === 0
        ) {
          if (rewardCount.limit1 > 0) {
            bingoReward = BINGO_REWARD_ONE_LINE
          } else if (rewardCount.limit1 === 0) {
            bingoReward = BINGO_REWARD_ZERO_LINE
          }
        }
      } else if (rewardCountKey === 'limit8') {
        // 제한 걸린 보상은 하위 보상으로
        // 8줄 완성했지만 보상제한, 3줄 횟수 있을 경우
        if (bingoReward === BINGO_REWARD_EIGHT_LINE && rewardCount.limit3 > 0) {
          bingoReward = BINGO_REWARD_THREE_LINE
        }
        // 8줄 완성했지만 8줄 보상제한, 하위 3줄 보상제한, 하위 1줄 보상횟수 남아있음
        else if (
          bingoReward === BINGO_REWARD_EIGHT_LINE &&
          rewardCount.limit3 === 0
        ) {
          if (rewardCount.limit1 > 0) {
            bingoReward = BINGO_REWARD_ONE_LINE
          } else if (rewardCount.limit1 === 0) {
            bingoReward = BINGO_REWARD_ZERO_LINE
          }
        }
      }
    }
  }

  const disableBingoRewardVaues = ['1', '3', '8'].filter(
    (el) => el !== bingoReward
  )

  return [bingoReward, disableBingoRewardVaues]
}

for (let i = 1; i < 9; i++) {
  const [bingoReward, disableBingoRewardVaues] = bingoValidator(i, rewardCount)
  console.log(
    `활성화버튼: ${bingoReward}, 비활성화: ${disableBingoRewardVaues.join(
      ', '
    )}   (완성줄 수: ${i}, 한줄 보상제한: ${
      rewardCount.limit1
    }, 세줄 보상제한: ${rewardCount.limit3}, 전체줄 보상제한: ${
      rewardCount.limit8
    })`
  )
}
