# Dialog Animation Optimization

## 🐛 Problem

Dialog closing animation was abrupt and not smooth like the opening animation. The dialog would disappear instantly without playing the exit animation.

## 🔍 Root Cause

When `closeView(id)` was called, it immediately removed the view from the `viewStackAtom`, causing the component to unmount before the Radix UI animation could complete.

## ✅ Solution

### 1. Added `isOpen` State to ViewConfig

Modified `view-atoms.ts` to track the open/close state:

```typescript
export interface ViewConfig {
  // ... existing fields
  isOpen?: boolean // NEW: Track open state for smooth animations
}
```

### 2. Implemented Two-Phase Close

Changed `closeViewAtom` to use a two-phase approach:

**Phase 1**: Set `isOpen: false` to trigger closing animation
**Phase 2**: Remove from stack after animation completes (300ms)

```typescript
export const closeViewAtom = atom(null, (get, set, id: string) => {
  const views = get(viewStackAtom)
  
  // Phase 1: Trigger closing animation
  const updatedViews = views.map((v) => 
    v.id === id ? { ...v, isOpen: false } : v
  )
  set(viewStackAtom, updatedViews)

  // Phase 2: Remove after animation (300ms)
  setTimeout(() => {
    const currentViews = get(viewStackAtom)
    set(viewStackAtom, currentViews.filter((v) => v.id !== id))
  }, 300)
})
```

### 3. Updated ViewRenderer

Changed from `open={true}` to `open={isOpen}`:

```typescript
const isOpen = config.isOpen ?? true

// Dialog
<Dialog open={isOpen} onOpenChange={(open) => !open && closeView(config.id)}>

// Sheet
<Sheet open={isOpen} onOpenChange={(open) => !open && closeView(config.id)}>

// Page (full-screen)
<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div key={config.id} exit={{ opacity: 0 }} />
  )}
</AnimatePresence>
```

### 4. Optimized Animation Durations

**Dialog Component** (`dialog.tsx`):
- Changed `duration-200` → `duration-300`
- Added slide animation: `data-[state=closed]:slide-out-to-top-[2%]`
- Added overlay transition: `transition-all duration-300`

**Sheet Component** (`sheet.tsx`):
- Changed `data-[state=closed]:duration-300 data-[state=open]:duration-500` → `duration-300` (consistent)
- Changed `transition ease-in-out` → `transition-all ease-in-out duration-300`
- Added overlay transition: `transition-all duration-300`

**Page Component** (Framer Motion):
- Added explicit transition: `transition={{ duration: 0.2 }}`
- Added `mode="wait"` to AnimatePresence

## 📊 Results

✅ **Smooth closing animations** - Dialog, Sheet, and Page views now have consistent exit animations
✅ **No visual glitches** - Components stay mounted during animation
✅ **Consistent timing** - All animations use 300ms duration
✅ **Better UX** - Professional feel with smooth transitions

## 🎨 Animation Details

### Dialog
- **Opening**: Fade in + Zoom in (95% → 100%) + Slide from top (2%)
- **Closing**: Fade out + Zoom out (100% → 95%) + Slide to top (2%)
- **Duration**: 300ms

### Sheet (Sidebar)
- **Opening**: Fade in + Slide from side
- **Closing**: Fade out + Slide to side
- **Duration**: 300ms

### Page (Full-screen)
- **Opening**: Fade in
- **Closing**: Fade out
- **Duration**: 200ms (faster for full-screen)

## 🔧 Technical Notes

1. **Timing is critical**: The setTimeout duration (300ms) must match the CSS animation duration
2. **State management**: Using Jotai atoms for centralized state management
3. **Radix UI**: Leverages Radix's built-in animation support with `data-[state]` attributes
4. **Framer Motion**: Used for custom page transitions with AnimatePresence

## 📝 Files Modified

1. `src/store/view-atoms.ts` - Added isOpen state and two-phase close logic
2. `src/components/view-manager/view-renderer.tsx` - Updated to use isOpen state
3. `src/components/ui/dialog.tsx` - Optimized animation classes and durations
4. `src/components/ui/sheet.tsx` - Optimized animation classes and durations

## 🚀 Usage

No changes needed in consuming code! The Dialog & Form system continues to work the same way:

```typescript
const { openView, closeView } = useView()

// Open dialog
openView({
  type: 'dialog',
  component: MyForm,
  title: 'Edit User',
})

// Close will now animate smoothly!
closeView(viewId)
```

## 🎯 Best Practices

1. **Consistent durations**: Keep all animations at 300ms for consistency
2. **Easing functions**: Use `ease-in-out` for natural motion
3. **AnimatePresence**: Always wrap Framer Motion components with AnimatePresence
4. **Cleanup**: Always use setTimeout for delayed cleanup to prevent memory leaks

