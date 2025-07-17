#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
//#import <RNBootSplash/RNBootSplash.h>
//#import <RNNotifee/NotifeeCore.h>
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"FuneralProject";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Notifee 초기화
//  [Notifee configure];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Splash screen customization
//- (void)customize:(RCTRootView *)rootView
//{
//  [super customize:rootView];
//  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];
//}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end 
