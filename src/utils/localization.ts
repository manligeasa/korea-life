import { Category, ChecklistItem, EmergencyContact, GuideItem, Language, TrashItem } from '../types';

export function getCategoryTitle(cat: Category, lang: Language): string {
  switch (lang) {
    case 'en': return cat.nameEn || cat.nameKo;
    case 'vi': return cat.nameVi || cat.nameEn || cat.nameKo;
    case 'zh': return cat.nameZh || cat.nameKo;
    case 'ja': return cat.nameJa || cat.nameKo;
    case 'fil': return cat.nameFil || cat.nameEn || cat.nameKo;
    case 'km': return cat.nameKm || cat.nameEn || cat.nameKo;
    case 'uz': return cat.nameUz || cat.nameEn || cat.nameKo;
    case 'ne': return cat.nameNe || cat.nameEn || cat.nameKo;
    default: return cat.nameKo;
  }
}

export function getCategoryDesc(cat: Category, lang: Language): string {
  switch (lang) {
    case 'en': return cat.descriptionEn || cat.descriptionKo;
    case 'vi': return cat.descriptionVi || cat.descriptionEn || cat.descriptionKo;
    case 'zh': return cat.descriptionZh || cat.descriptionKo;
    case 'ja': return cat.descriptionJa || cat.descriptionKo;
    case 'fil': return cat.descriptionFil || cat.descriptionEn || cat.descriptionKo;
    case 'km': return cat.descriptionKm || cat.descriptionEn || cat.descriptionKo;
    case 'uz': return cat.descriptionUz || cat.descriptionEn || cat.descriptionKo;
    case 'ne': return cat.descriptionNe || cat.descriptionEn || cat.descriptionKo;
    default: return cat.descriptionKo;
  }
}

export function getGuideTitle(guide: GuideItem, lang: Language): string {
  switch (lang) {
    case 'en': return guide.titleEn || guide.titleKo;
    case 'vi': return guide.titleVi || guide.titleEn || guide.titleKo;
    case 'zh': return guide.titleZh || guide.titleKo;
    case 'ja': return guide.titleJa || guide.titleKo;
    case 'fil': return guide.titleFil || guide.titleEn || guide.titleKo;
    case 'km': return guide.titleKm || guide.titleEn || guide.titleKo;
    case 'uz': return guide.titleUz || guide.titleEn || guide.titleKo;
    case 'ne': return guide.titleNe || guide.titleEn || guide.titleKo;
    default: return guide.titleKo;
  }
}

export function getGuideSummary(guide: GuideItem, lang: Language): string {
  switch (lang) {
    case 'en': return guide.summaryEn || guide.summaryKo;
    case 'vi': return guide.summaryVi || guide.summaryEn || guide.summaryKo;
    case 'zh': return guide.summaryZh || guide.summaryKo;
    case 'ja': return guide.summaryJa || guide.summaryKo;
    case 'fil': return guide.summaryFil || guide.summaryEn || guide.summaryKo;
    case 'km': return guide.summaryKm || guide.summaryEn || guide.summaryKo;
    case 'uz': return guide.summaryUz || guide.summaryEn || guide.summaryKo;
    case 'ne': return guide.summaryNe || guide.summaryEn || guide.summaryKo;
    default: return guide.summaryKo;
  }
}

export function getGuideContent(guide: GuideItem, lang: Language): string[] {
  switch (lang) {
    case 'en': return guide.contentEn.length ? guide.contentEn : guide.contentKo;
    case 'vi': return guide.contentVi && guide.contentVi.length ? guide.contentVi : (guide.contentEn.length ? guide.contentEn : guide.contentKo);
    case 'zh': return guide.contentZh && guide.contentZh.length ? guide.contentZh : guide.contentKo;
    case 'ja': return guide.contentJa && guide.contentJa.length ? guide.contentJa : guide.contentKo;
    case 'fil': return guide.contentFil && guide.contentFil.length ? guide.contentFil : (guide.contentEn.length ? guide.contentEn : guide.contentKo);
    case 'km': return guide.contentKm && guide.contentKm.length ? guide.contentKm : (guide.contentEn.length ? guide.contentEn : guide.contentKo);
    case 'uz': return guide.contentUz && guide.contentUz.length ? guide.contentUz : (guide.contentEn.length ? guide.contentEn : guide.contentKo);
    case 'ne': return guide.contentNe && guide.contentNe.length ? guide.contentNe : (guide.contentEn.length ? guide.contentEn : guide.contentKo);
    default: return guide.contentKo;
  }
}

export function getGuideKeyTips(guide: GuideItem, lang: Language): string[] {
  switch (lang) {
    case 'en': return guide.keyTipsEn.length ? guide.keyTipsEn : guide.keyTipsKo;
    case 'vi': return guide.keyTipsVi && guide.keyTipsVi.length ? guide.keyTipsVi : (guide.keyTipsEn.length ? guide.keyTipsEn : guide.keyTipsKo);
    case 'zh': return guide.keyTipsZh && guide.keyTipsZh.length ? guide.keyTipsZh : guide.keyTipsKo;
    case 'ja': return guide.keyTipsJa && guide.keyTipsJa.length ? guide.keyTipsJa : guide.keyTipsKo;
    case 'fil': return guide.keyTipsFil && guide.keyTipsFil.length ? guide.keyTipsFil : (guide.keyTipsEn.length ? guide.keyTipsEn : guide.keyTipsKo);
    case 'km': return guide.keyTipsKm && guide.keyTipsKm.length ? guide.keyTipsKm : (guide.keyTipsEn.length ? guide.keyTipsEn : guide.keyTipsKo);
    case 'uz': return guide.keyTipsUz && guide.keyTipsUz.length ? guide.keyTipsUz : (guide.keyTipsEn.length ? guide.keyTipsEn : guide.keyTipsKo);
    case 'ne': return guide.keyTipsNe && guide.keyTipsNe.length ? guide.keyTipsNe : (guide.keyTipsEn.length ? guide.keyTipsEn : guide.keyTipsKo);
    default: return guide.keyTipsKo;
  }
}

export function getTrashName(item: TrashItem, lang: Language): string {
  switch (lang) {
    case 'en': return item.nameEn || item.nameKo;
    case 'vi': return item.nameVi || item.nameEn || item.nameKo;
    case 'zh': return item.nameZh || item.nameKo;
    case 'ja': return item.nameJa || item.nameKo;
    case 'fil': return item.nameFil || item.nameEn || item.nameKo;
    case 'km': return item.nameKm || item.nameEn || item.nameKo;
    case 'uz': return item.nameUz || item.nameEn || item.nameKo;
    case 'ne': return item.nameNe || item.nameEn || item.nameKo;
    default: return item.nameKo;
  }
}

export function getTrashInstructions(item: TrashItem, lang: Language): string {
  switch (lang) {
    case 'en': return item.instructionsEn || item.instructionsKo;
    case 'vi': return item.instructionsVi || item.instructionsEn || item.instructionsKo;
    case 'zh': return item.instructionsZh || item.instructionsKo;
    case 'ja': return item.instructionsJa || item.instructionsKo;
    case 'fil': return item.instructionsFil || item.instructionsEn || item.instructionsKo;
    case 'km': return item.instructionsKm || item.instructionsEn || item.instructionsKo;
    case 'uz': return item.instructionsUz || item.instructionsEn || item.instructionsKo;
    case 'ne': return item.instructionsNe || item.instructionsEn || item.instructionsKo;
    default: return item.instructionsKo;
  }
}

export function getChecklistTitle(item: ChecklistItem, lang: Language): string {
  switch (lang) {
    case 'en': return item.titleEn || item.titleKo;
    case 'vi': return item.titleVi || item.titleEn || item.titleKo;
    case 'zh': return item.titleZh || item.titleKo;
    case 'ja': return item.titleJa || item.titleKo;
    case 'fil': return item.titleFil || item.titleEn || item.titleKo;
    case 'km': return item.titleKm || item.titleEn || item.titleKo;
    case 'uz': return item.titleUz || item.titleEn || item.titleKo;
    case 'ne': return item.titleNe || item.titleEn || item.titleKo;
    default: return item.titleKo;
  }
}

export function getChecklistDesc(item: ChecklistItem, lang: Language): string {
  switch (lang) {
    case 'en': return item.descriptionEn || item.descriptionKo;
    case 'vi': return item.descriptionVi || item.descriptionEn || item.descriptionKo;
    case 'zh': return item.descriptionZh || item.descriptionKo;
    case 'ja': return item.descriptionJa || item.descriptionKo;
    case 'fil': return item.descriptionFil || item.descriptionEn || item.descriptionKo;
    case 'km': return item.descriptionKm || item.descriptionEn || item.descriptionKo;
    case 'uz': return item.descriptionUz || item.descriptionEn || item.descriptionKo;
    case 'ne': return item.descriptionNe || item.descriptionEn || item.descriptionKo;
    default: return item.descriptionKo;
  }
}

export function getEmergencyName(contact: EmergencyContact, lang: Language): string {
  switch (lang) {
    case 'en': return contact.nameEn || contact.nameKo;
    case 'vi': return contact.nameVi || contact.nameEn || contact.nameKo;
    case 'zh': return contact.nameZh || contact.nameKo;
    case 'ja': return contact.nameJa || contact.nameKo;
    case 'fil': return contact.nameFil || contact.nameEn || contact.nameKo;
    case 'km': return contact.nameKm || contact.nameEn || contact.nameKo;
    case 'uz': return contact.nameUz || contact.nameEn || contact.nameKo;
    case 'ne': return contact.nameNe || contact.nameEn || contact.nameKo;
    default: return contact.nameKo;
  }
}
