package com.acessomaissegurosjm

import android.os.Bundle
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "AcessoMaisSeguroSJM"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    // Pass null to avoid state restoration issues if using splash screens
    super.onCreate(null) 
    hideNavigationBar()
  }

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)
    if (hasFocus) {
      hideNavigationBar()
    }
  }

  private fun hideNavigationBar() {
    val windowInsetsController = WindowCompat.getInsetsController(window, window.decorView)
    
    // Configure behavior: Bars appear briefly on swipe and then auto-hide
    windowInsetsController.systemBarsBehavior = 
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    
    // Hide the navigation bars (bottom buttons)
    // You can also add WindowInsetsCompat.Type.statusBars() to hide the top bar
    // windowInsetsController.hide(WindowInsetsCompat.Type.navigationBars())
    windowInsetsController.hide(WindowInsetsCompat.Type.systemBars())
  }
}