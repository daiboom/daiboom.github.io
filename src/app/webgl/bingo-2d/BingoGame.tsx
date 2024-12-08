'use client'

import BingoBoard from '@/app/webgl/bingo-2d/BingoBoard'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function BingoGame() {
  const [modalData, setModalData] = useState()
  const [completedLineCount, setCompletedLineCount] = useState(0)
  const [isRequest, setRequest] = useState(false)
  const [shareDisabled, setShareDisabled] = useState(false)
  const [manualRefresh, setManualRefresh] = useState({
    old: 0,
    new: 0,
  })
  const [type, setType] = useState(null)
  const [requestLine, setRequestLine] = useState('0')
  const screenshotRef = useRef(null)

  // 보상 횟수 상태 추가
  const [rewardCount, setRewardCount] = useState({
    line1: 0,
    line3: 0,
    line8: 0,
  })

  const isOneZero = rewardCount.line1 === 0
  const isThreeZero = rewardCount.line3 === 0
  const isEightZero = rewardCount.line8 === 0

  // 공유 기능
  const handleShare = useCallback(() => {
    if (screenshotRef.current) {
      setRequest(true)
      html2canvas(screenshotRef.current)
        .then((canvas) => {
          const imageData = canvas.toDataURL('image/jpeg')
          // 공유 로직 구현
        })
        .finally(() => {
          setRequest(false)
        })
    }
  }, [])

  useEffect(() => {
    if (isRequest) {
      setShareDisabled(true)
    } else {
      const timer = setTimeout(() => {
        setShareDisabled(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isRequest])

  const styles = {
    container: {
      padding: '0 22px',
    },
    playing: {
      display: 'flex',
      justifyContent: 'center',
      gap: '7px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '7px',
    },
    boldButton: {
      userSelect: 'none',
      width: '50%',
      background: '#191919',
      paddingTop: '1.5rem',
      paddingBottom: '.7rem',
      textAlign: 'center',
      borderRadius: '9999px',
      transition: 'all 0.2s',
      lineHeight: 'normal',
      cursor: 'pointer',
      border: 'none',
      '&:active': {
        background: '#333333',
      },
    },
    buttonTitle: {
      fontFamily: 'GmarketSans',
      fontWeight: 'bold',
      fontSize: '2.2rem',
      color: '#fff',
      margin: 0,
    },
    subtitle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#808080',
    },
    subtitleText: {
      fontSize: '1.45rem',
      fontWeight: 600,
      lineHeight: 'normal',
    },
    coinImage: {
      marginLeft: '3px',
      display: 'inline',
      width: '1.25rem',
      height: '1.25rem',
    },
    shareButton: {
      width: '24.9rem',
      color: '#191919',
      background: '#f3f3f3',
      padding: '22px',
      borderRadius: '9999px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      opacity: shareDisabled ? 0.5 : 1,
      pointerEvents: shareDisabled ? 'none' : 'auto',
    },
  }

  const isOverReward = () => {
    return isOneZero && isThreeZero && isEightZero
  }

  const handleRestartClick = () => {
    if (isOverReward()) {
      alert('보상횟수를 초과하여 판바꾸기를 할 수 없습니다.')
      return false
    }
    setModalData({
      type: 'Restart',
      title: '빙고판 선택하고 판바꾸기',
    })
  }

  const handleRewardClick = () => {
    if (completedLineCount < 1) {
      alert('1줄 이상 완성해야 보상신청이 가능합니다.')
      return
    }
    setModalData({
      type: 'Rewards',
      title: '보상을 신청하시겠습니까?',
    })
  }

  return (
    <div>
      <div ref={screenshotRef}>
        <BingoBoard />
      </div>

      <div style={{ height: '24px' }} />

      <div style={styles.container}>
        <div style={styles.buttonContainer}>
          <button style={styles.boldButton} onClick={handleRestartClick}>
            <h3 style={styles.buttonTitle}>빙고판 다시뽑기</h3>
            <div style={styles.subtitle}>
              <span style={styles.subtitleText}>500</span>
              <Image
                style={styles.coinImage}
                src="/assets/common/ic-coin@3x.webp"
                alt="coin"
                width={20}
                height={20}
              />
            </div>
          </button>

          <button style={styles.boldButton} onClick={handleRewardClick}>
            <h3 style={styles.buttonTitle}>보상신청</h3>
            <span style={styles.subtitleText}>보상받기</span>
          </button>
        </div>

        <button
          style={styles.shareButton}
          onClick={handleShare}
          disabled={shareDisabled}
        >
          빙고판 공유하기 😁
        </button>
      </div>
    </div>
  )
}
