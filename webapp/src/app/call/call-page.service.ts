import { Injectable, OnDestroy } from '@angular/core';
import { CallStateEnum, UserCallMetadata } from '../models';

@Injectable()
export class CallPageService implements OnDestroy {


  ngOnDestroy(): void {
    console.log('ngOnDestroy: CallPageService.');
  }

  createDefaltUserSetting() {
    var defaultSetting: UserCallMetadata = {
      isFit: false,
      isMute: false,
      callState: CallStateEnum.waiting,
      uiLayout: {
        position: 'right',
        visibleButtons: {
          muteMic: true,
          muteAudio: true,
          fit: true,
          options: true,
          leave: true,
        }
      },
      workout: {
        title: 'new workout',
        exercises: []
      }
    };
    //debug:
    defaultSetting.workout = {
      title: 'new workout',
      exercises: [
        { title: 'warmpup', seconds: 30 },
        { title: 'push ups', seconds: 60 },
        { title: 'burpee', seconds: 60 },
      ]
    }
    return defaultSetting;
  }

  createDefaltRemoteUserSetting(): UserCallMetadata {
    const remoteUserSetting: UserCallMetadata = {
      isFit: false,
      isMute: false,
      callState: CallStateEnum.waiting,
      uiLayout: {
        position: 'left',
        visibleButtons: {
          muteMic: false,
          muteAudio: false,
          fit: true,
          options: false,
          leave: false,
        }
      },
      workout: {
        title: 'new workout',
        exercises: []
      }
    };
    //debug:
    remoteUserSetting.workout = {
      title: 'new workout',
      exercises: [
        { title: 'warmpup', seconds: 30 },
        { title: 'push ups', seconds: 60 },
        { title: 'burpee', seconds: 60 },
      ]
    }

    return remoteUserSetting;
  }
}
