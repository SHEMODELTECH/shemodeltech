// Enhanced ownership detection functions with company admin role support

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

// 🔥 ENHANCED: Company ownership detection with admin role checking
const checkCompanyOwnership = async (company, currentUser) => {
  if (!company || !currentUser) {
    console.log('❌ checkCompanyOwnership: Missing company or user data');
    return false;
  }
  
  const userEmail = currentUser.email?.toLowerCase();
  const userId = currentUser.uid;
  
  console.log('🔍 Checking company ownership for:', {
    companyId: company.id,
    companyName: company.companyName,
    userEmail: userEmail,
    userId: userId
  });

  // 🔥 STEP 1: Check direct ownership fields on company document
  const directOwnershipChecks = {
    // Direct email checks (case-insensitive)
    ownerEmail: company.ownerEmail?.toLowerCase() === userEmail,
    adminEmail: company.adminEmail?.toLowerCase() === userEmail,
    createdByEmail: company.createdByEmail?.toLowerCase() === userEmail,
    creatorEmail: company.creatorEmail?.toLowerCase() === userEmail,
    founderEmail: company.founderEmail?.toLowerCase() === userEmail,
    ceoEmail: company.ceoEmail?.toLowerCase() === userEmail,
    contactEmail: company.contactEmail?.toLowerCase() === userEmail,
    managerEmail: company.managerEmail?.toLowerCase() === userEmail,
    companyOwnerEmail: company.companyOwnerEmail?.toLowerCase() === userEmail,
    companyAdminEmail: company.companyAdminEmail?.toLowerCase() === userEmail,
    primaryContactEmail: company.primaryContactEmail?.toLowerCase() === userEmail,
    
    // Direct ID checks
    createdBy: company.createdBy === userId,
    founderId: company.founderId === userId,
    ownerId: company.ownerId === userId,
    creatorId: company.creatorId === userId,
    adminId: company.adminId === userId,
    companyOwnerId: company.companyOwnerId === userId,
    
    // Array checks for multiple admins/owners
    isInAdmins: Array.isArray(company.admins) && company.admins.some(admin => 
      (typeof admin === 'string' && admin.toLowerCase() === userEmail) ||
      (typeof admin === 'object' && (admin?.email?.toLowerCase() === userEmail || admin?.id === userId))
    ),
    isInAdminEmails: Array.isArray(company.adminEmails) && company.adminEmails.some(email => 
      email?.toLowerCase() === userEmail
    ),
    isInOwners: Array.isArray(company.owners) && company.owners.some(owner => 
      (typeof owner === 'string' && owner.toLowerCase() === userEmail) ||
      (typeof owner === 'object' && (owner?.email?.toLowerCase() === userEmail || owner?.id === userId))
    ),
    isInOwnerEmails: Array.isArray(company.ownerEmails) && company.ownerEmails.some(email => 
      email?.toLowerCase() === userEmail
    ),
    isInFounders: Array.isArray(company.founders) && company.founders.some(founder => 
      (typeof founder === 'string' && founder.toLowerCase() === userEmail) ||
      (typeof founder === 'object' && (founder?.email?.toLowerCase() === userEmail || founder?.id === userId))
    ),
    isInManagers: Array.isArray(company.managers) && company.managers.some(manager => 
      (typeof manager === 'string' && manager.toLowerCase() === userEmail) ||
      (typeof manager === 'object' && (manager?.email?.toLowerCase() === userEmail || manager?.id === userId))
    )
  };

  console.log('🔍 Direct company ownership checks:', {
    companyId: company.id,
    checks: directOwnershipChecks
  });

  // Check if any direct ownership field matches
  const hasDirectOwnership = Object.values(directOwnershipChecks).some(check => check === true);

  // 🔥 STEP 2: Check company_members collection for admin role
  let hasAdminRole = false;
  try {
    console.log('👥 Checking company_members collection for admin role...');
    
    const memberQuery = query(
      collection(db, 'company_members'),
      where('companyId', '==', company.id),
      where('userEmail', '==', currentUser.email),
      where('status', '==', 'active')
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    
    if (!memberSnapshot.empty) {
      const memberData = memberSnapshot.docs[0].data();
      hasAdminRole = memberData.role === 'admin' || memberData.role === 'owner';
      
      console.log('👥 Company member data found:', {
        companyId: company.id,
        userEmail: currentUser.email,
        role: memberData.role,
        hasAdminRole: hasAdminRole,
        memberData: memberData
      });
    } else {
      console.log('👥 No active membership found in company_members collection');
    }
    
  } catch (memberError) {
    console.error('❌ Error checking company_members collection:', memberError);
    hasAdminRole = false;
  }

  // 🔥 STEP 3: Combine all ownership checks
  const isOwnerOrAdmin = hasDirectOwnership || hasAdminRole;

  console.log(`${isOwnerOrAdmin ? '✅' : '❌'} Company ownership result:`, {
    companyName: company.companyName,
    hasDirectOwnership: hasDirectOwnership,
    hasAdminRole: hasAdminRole,
    isOwnerOrAdmin: isOwnerOrAdmin,
    directMatches: Object.entries(directOwnershipChecks).filter(([key, value]) => value === true),
    adminRoleCheck: hasAdminRole ? 'Found admin role in company_members' : 'No admin role found'
  });
  
  return isOwnerOrAdmin;
};

// 🔥 ENHANCED: Project ownership detection (keeping existing logic)
const checkProjectOwnership = (project, currentUser) => {
  if (!project || !currentUser) {
    console.log('❌ checkProjectOwnership: Missing project or user data');
    return false;
  }
  
  const userEmail = currentUser.email?.toLowerCase();
  const userId = currentUser.uid;
  
  console.log('🔍 Checking project ownership for:', {
    projectId: project.id,
    projectTitle: project.projectTitle,
    userEmail: userEmail,
    userId: userId
  });

  const ownershipChecks = {
    // Direct email checks (case-insensitive)
    ownerEmail: project.ownerEmail?.toLowerCase() === userEmail,
    creatorEmail: project.creatorEmail?.toLowerCase() === userEmail,
    submitterEmail: project.submitterEmail?.toLowerCase() === userEmail,
    organizerEmail: project.organizerEmail?.toLowerCase() === userEmail,
    projectManagerEmail: project.projectManagerEmail?.toLowerCase() === userEmail,
    contactEmail: project.contactEmail?.toLowerCase() === userEmail,
    adminEmail: project.adminEmail?.toLowerCase() === userEmail,
    clientEmail: project.clientEmail?.toLowerCase() === userEmail,
    projectOwnerEmail: project.projectOwnerEmail?.toLowerCase() === userEmail,
    leaderEmail: project.leaderEmail?.toLowerCase() === userEmail,
    
    // Direct ID checks
    submitterId: project.submitterId === userId,
    ownerId: project.ownerId === userId,
    creatorId: project.creatorId === userId,
    projectManagerId: project.projectManagerId === userId,
    clientId: project.clientId === userId,
    founderId: project.founderId === userId,
    
    // Array checks
    isInOwners: Array.isArray(project.owners) && project.owners.some(owner => 
      (typeof owner === 'string' && owner.toLowerCase() === userEmail) ||
      (typeof owner === 'object' && (owner?.email?.toLowerCase() === userEmail || owner?.id === userId))
    ),
    isInAdmins: Array.isArray(project.admins) && project.admins.some(admin => 
      (typeof admin === 'string' && admin.toLowerCase() === userEmail) ||
      (typeof admin === 'object' && (admin?.email?.toLowerCase() === userEmail || admin?.id === userId))
    ),
    isInProjectManagers: Array.isArray(project.projectManagers) && project.projectManagers.some(pm => 
      (typeof pm === 'string' && pm.toLowerCase() === userEmail) ||
      (typeof pm === 'object' && (pm?.email?.toLowerCase() === userEmail || pm?.id === userId))
    )
  };

  const isOwner = Object.values(ownershipChecks).some(check => check === true);
  
  console.log(`${isOwner ? '✅' : '❌'} Project ownership result:`, {
    projectTitle: project.projectTitle,
    isOwner: isOwner,
    matchedChecks: Object.entries(ownershipChecks).filter(([key, value]) => value === true)
  });
  
  return isOwner;
};

// 🔥 NEW: Function to fetch user projects with ownership detection
const fetchUserProjectsWithOwnership = async (currentUser) => {
  if (!currentUser) {
    return {
      availableProjects: [],
      userProjectMemberships: [],
      ownedProjects: []
    };
  }

  try {
    console.log('🔍 Fetching user projects with ownership detection...');
    
    // Get ALL projects for ownership checking
    const projectsQuery = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    );

    const projectsSnapshot = await getDocs(projectsQuery);
    const allProjects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('📋 Found total projects in system:', allProjects.length);

    // Check ownership for each project
    const ownedProjects = [];
    const ownershipDebug = {};
    
    for (const project of allProjects) {
      const isOwner = checkProjectOwnership(project, currentUser);
      ownershipDebug[project.id] = {
        title: project.projectTitle,
        status: project.status,
        isOwner: isOwner
      };
      
      if (isOwner) {
        ownedProjects.push(project);
      }
    }

    // Filter to only owned projects (for event creation, users can only create events for projects they own)
    const availableProjects = ownedProjects.filter(project => {
      const isActive = project.status === 'active' || !project.status;
      return isActive;
    });

    console.log('📋 Project ownership summary:', {
      totalProjectsInSystem: allProjects.length,
      ownedProjects: ownedProjects.length,
      availableForEvents: availableProjects.length
    });

    return {
      availableProjects: availableProjects,
      userProjectMemberships: ownedProjects.map(p => p.id), // For compatibility
      ownedProjects: ownedProjects,
      ownershipDebug: ownershipDebug
    };

  } catch (error) {
    console.error('❌ Error in fetchUserProjectsWithOwnership:', error);
    return {
      availableProjects: [],
      userProjectMemberships: [],
      ownedProjects: [],
      error: error.message
    };
  }
};

// 🔥 ENHANCED: Comprehensive fetching function for user companies with admin role detection
const fetchUserCompaniesWithAdminRoles = async (currentUser) => {
  if (!currentUser) {
    return {
      availableCompanies: [],
      userCompanyMemberships: [],
      ownedCompanies: [],
      adminCompanies: []
    };
  }

  try {
    console.log('🔍 ENHANCED: Fetching user companies with admin role detection...');
    
    // STEP 1: Get ALL companies for ownership checking
    const companiesQuery = query(
      collection(db, 'companies'),
      orderBy('createdAt', 'desc')
    );

    const companiesSnapshot = await getDocs(companiesQuery);
    const allCompanies = companiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('🏢 Found total companies in system:', allCompanies.length);

    // STEP 2: Get user's memberships from company_members collection
    const membershipQuery = query(
      collection(db, 'company_members'),
      where('userEmail', '==', currentUser.email),
      where('status', '==', 'active')
    );

    const membershipSnapshot = await getDocs(membershipQuery);
    const membershipData = membershipSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const memberCompanyIds = membershipData.map(membership => membership.companyId);
    const adminCompanyIds = membershipData
      .filter(membership => membership.role === 'admin' || membership.role === 'owner')
      .map(membership => membership.companyId);

    console.log('🏢 Membership analysis:', {
      totalMemberships: membershipData.length,
      memberCompanyIds: memberCompanyIds,
      adminCompanyIds: adminCompanyIds,
      membershipBreakdown: membershipData.reduce((acc, m) => {
        acc[m.role || 'unknown'] = (acc[m.role || 'unknown'] || 0) + 1;
        return acc;
      }, {})
    });

    // STEP 3: Check direct ownership for each company
    const ownedCompanies = [];
    const ownershipDebug = {};
    
    for (const company of allCompanies) {
      const isDirectOwner = await checkCompanyOwnership(company, currentUser);
      ownershipDebug[company.id] = {
        name: company.companyName,
        status: company.status,
        isDirectOwner,
        hasAdminRole: adminCompanyIds.includes(company.id),
        hasMembership: memberCompanyIds.includes(company.id),
        overallAccess: isDirectOwner || adminCompanyIds.includes(company.id) || memberCompanyIds.includes(company.id)
      };
      
      if (isDirectOwner) {
        ownedCompanies.push(company);
      }
    }

    const ownedCompanyIds = ownedCompanies.map(c => c.id);

    // STEP 4: Combine all access types
    const allUserCompanyIds = [...new Set([...memberCompanyIds, ...ownedCompanyIds])];
    
    // STEP 5: Filter to accessible companies (owned, admin, or member) AND active status
    const accessibleCompanies = allCompanies.filter(company => {
      const hasAccess = allUserCompanyIds.includes(company.id);
      const isActive = company.status === 'active' || !company.status;
      return hasAccess && isActive;
    });

    // STEP 6: Separate admin companies for special privileges
    const adminCompanies = accessibleCompanies.filter(company => 
      adminCompanyIds.includes(company.id) || ownedCompanyIds.includes(company.id)
    );

    console.log('🏢 ENHANCED Company access summary:', {
      totalCompaniesInSystem: allCompanies.length,
      memberCompanies: memberCompanyIds.length,
      adminCompanies: adminCompanies.length,
      ownedCompanies: ownedCompanyIds.length,
      totalAccessible: accessibleCompanies.length,
      adminPrivileges: adminCompanyIds.length
    });

    return {
      availableCompanies: accessibleCompanies,
      userCompanyMemberships: allUserCompanyIds,
      ownedCompanies: ownedCompanies,
      adminCompanies: adminCompanies,
      ownershipDebug: ownershipDebug
    };

  } catch (error) {
    console.error('❌ Error in fetchUserCompaniesWithAdminRoles:', error);
    return {
      availableCompanies: [],
      userCompanyMemberships: [],
      ownedCompanies: [],
      adminCompanies: [],
      error: error.message
    };
  }
};

// 🔥 ENHANCED: Integration function for EventSubmission component
const fetchUserAssociationsForEvents = async (currentUser) => {
  console.log('🎯 Fetching user associations for event creation...');
  
  try {
    // Fetch projects (using the new function)
    const projectsResult = await fetchUserProjectsWithOwnership(currentUser);
    
    // Fetch companies with admin role detection
    const companiesResult = await fetchUserCompaniesWithAdminRoles(currentUser);
    
    const result = {
      projects: {
        available: projectsResult.availableProjects || [],
        memberships: projectsResult.userProjectMemberships || [],
        owned: projectsResult.ownedProjects || []
      },
      companies: {
        available: companiesResult.availableCompanies || [],
        memberships: companiesResult.userCompanyMemberships || [],
        owned: companiesResult.ownedCompanies || [],
        admin: companiesResult.adminCompanies || [] // 🔥 NEW: Companies where user has admin privileges
      },
      debug: {
        projectOwnership: projectsResult.ownershipDebug || {},
        companyOwnership: companiesResult.ownershipDebug || {}
      }
    };

    console.log('🎯 Event associations summary:', {
      projects: {
        total: result.projects.available.length,
        owned: result.projects.owned.length
      },
      companies: {
        total: result.companies.available.length,
        owned: result.companies.owned.length,
        admin: result.companies.admin.length // 🔥 This includes company admins
      }
    });

    return result;
    
  } catch (error) {
    console.error('❌ Error fetching user associations:', error);
    return {
      projects: { available: [], memberships: [], owned: [] },
      companies: { available: [], memberships: [], owned: [], admin: [] },
      error: error.message
    };
  }
};

export {
  checkCompanyOwnership,
  checkProjectOwnership,
  fetchUserProjectsWithOwnership,
  fetchUserCompaniesWithAdminRoles,
  fetchUserAssociationsForEvents
};
