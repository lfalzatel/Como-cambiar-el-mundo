'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, MapPin, Users, Star, Plus, Heart, TrendingUp, Share2 } from 'lucide-react';
import { CreateEventModal } from '@/components/create-event-modal';
import { EventList, sampleEvents } from '@/components/event-list';
import { AttendEventModal } from '@/components/attend-event-modal';
import { EventDetailsModal } from '@/components/event-details-modal';
import { CreateExperienceModal } from '@/components/create-experience-modal';
import { ExperienceList, sampleExperiences } from '@/components/experience-list';

export default function Home() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState(sampleEvents);
  const [experiences, setExperiences] = useState(sampleExperiences);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [attendModalOpen, setAttendModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    const savedExperiences = localStorage.getItem('experiences');
    
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
      }
    }
    
    if (savedExperiences) {
      try {
        setExperiences(JSON.parse(savedExperiences));
      } catch (error) {
        console.error('Error loading experiences from localStorage:', error);
      }
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [events]);

  // Save experiences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('experiences', JSON.stringify(experiences));
    } catch (error) {
      console.error('Error saving experiences to localStorage:', error);
    }
  }, [experiences]);

  const handleEventCreated = (newEvent: any) => {
    // Add the new event to the state immediately
    const eventToAdd = {
      id: Date.now().toString(), // Generate temporary ID
      ...newEvent,
      attendeeCount: 0,
      averageRating: 0,
      ratingCount: 0,
      category: 'Nuevo'
    };
    
    setEvents(prev => [eventToAdd, ...prev]);
    alert('¡Evento creado exitosamente! Ahora puedes verlo en la lista.');
  };

  const handleAttendEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setAttendModalOpen(true);
    }
  };

  const handleViewEventDetails = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setDetailsModalOpen(true);
    }
  };

  const handleAttendConfirm = (attendee: any) => {
    // Update the event attendee count
    setEvents(prev => prev.map(event => 
      event.id === selectedEvent?.id 
        ? { ...event, attendeeCount: event.attendeeCount + 1 }
        : event
    ));
    
    // Add to sample attendees list for persistence
    const newAttendee = {
      id: Date.now().toString(),
      name: attendee.name,
      email: attendee.email,
      phone: attendee.phone,
      eventId: selectedEvent?.id || '',
      createdAt: new Date().toISOString()
    };
    
    // This would normally be saved to database
    console.log('New attendee added:', newAttendee);
    
    alert(`¡Gracias ${attendee.name}! Te has inscrito exitosamente al evento "${selectedEvent?.name}".`);
  };

  const handleExperienceCreated = (newExperience: any) => {
    // Add the new experience to the state immediately
    const experienceToAdd = {
      id: Date.now().toString(), // Generate temporary ID
      ...newExperience,
      createdAt: new Date().toISOString(),
      averageRating: 0,
      ratingCount: 0,
      category: 'Nueva'
    };
    
    setExperiences(prev => [experienceToAdd, ...prev]);
    alert('¡Experiencia compartida exitosamente! Ahora puedes verla en la lista.');
  };

  const handleManageAttendees = (eventId: string) => {
    console.log('Managing attendees for event:', eventId);
    // This is handled by the AttendeeManagement component
  };

  const handleRateEvent = (eventId: string, rating?: number, comment?: string) => {
    if (rating) {
      // Update the event rating
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          const newRatingCount = event.ratingCount + 1;
          const newAverageRating = ((event.averageRating * event.ratingCount) + rating) / newRatingCount;
          return {
            ...event,
            averageRating: newAverageRating,
            ratingCount: newRatingCount
          };
        }
        return event;
      }));
      
      alert(`¡Has calificado el evento con ${rating} estrella${rating !== 1 ? 's' : ''}!`);
    } else {
      alert('Por favor selecciona una calificación de 1 a 5 estrellas.');
    }
  };

  const handleRateExperience = (experienceId: string, rating?: number, comment?: string) => {
    if (rating) {
      // Update the experience rating
      setExperiences(prev => prev.map(experience => {
        if (experience.id === experienceId) {
          const newRatingCount = experience.ratingCount + 1;
          const newAverageRating = ((experience.averageRating * experience.ratingCount) + rating) / newRatingCount;
          return {
            ...experience,
            averageRating: newAverageRating,
            ratingCount: newRatingCount
          };
        }
        return experience;
      }));
      
      alert(`¡Has calificado la experiencia con ${rating} estrella${rating !== 1 ? 's' : ''}!`);
    } else {
      alert('Por favor selecciona una calificación de 1 a 5 estrellas.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cambiando el Mundo</h1>
                <p className="text-sm text-muted-foreground">Gestión de Eventos de Altruismo y Reciprocidad</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unidos por un <span className="text-primary">Mejor Mundo</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Organiza eventos de altruismo, comparte experiencias de reciprocidad y sé parte del cambio que quieres ver en el mundo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CreateEventModal 
              onEventCreated={handleEventCreated}
              trigger={
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-5 w-5 mr-2" />
                  Crear Nuevo Evento
                </Button>
              }
            />
            <CreateExperienceModal 
              onExperienceCreated={handleExperienceCreated}
              trigger={
                <Button size="lg" variant="outline" className="border-secondary text-secondary-foreground hover:bg-secondary">
                  <Heart className="h-5 w-5 mr-2" />
                  Compartir Experiencia
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Experiencias
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Reportes
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-foreground">Próximos Eventos</h3>
              <CreateEventModal onEventCreated={handleEventCreated} />
            </div>

            <EventList 
              events={events}
              onAttend={handleAttendEvent}
              onViewDetails={handleViewEventDetails}
              onRate={handleRateEvent}
              onManageAttendees={handleManageAttendees}
            />
          </TabsContent>

          {/* Experiences Tab */}
          <TabsContent value="experiences" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-foreground">Experiencias de la Comunidad</h3>
              <CreateExperienceModal onExperienceCreated={handleExperienceCreated} />
            </div>

            <ExperienceList 
              experiences={experiences}
              onRate={handleRateExperience}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Reportes y Estadísticas</h3>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{events.length}</div>
                  <p className="text-xs text-muted-foreground">+3 este mes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Asistentes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {events.reduce((sum, event) => sum + event.attendeeCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">+45 este mes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Experiencias</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{experiences.length}</div>
                  <p className="text-xs text-muted-foreground">+12 este mes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {events.length > 0 
                      ? (events.reduce((sum, event) => sum + event.averageRating * event.ratingCount, 0) / 
                         events.reduce((sum, event) => sum + event.ratingCount, 0)).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">De 5 estrellas</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Eventos Recientes con Calificaciones</CardTitle>
                <CardDescription>Resumen de los últimos eventos y sus evaluaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-muted-foreground">{event.attendeeCount} asistentes</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-medium">{event.averageRating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{event.ratingCount} calificaciones</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Cambiando el Mundo</span>
            </div>
            <p className="text-muted-foreground">
              Juntos creamos un impacto positivo a través del altruismo y la reciprocidad.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AttendEventModal
        open={attendModalOpen}
        onOpenChange={setAttendModalOpen}
        onConfirm={handleAttendConfirm}
        eventName={selectedEvent?.name || ''}
      />

      <EventDetailsModal
        event={selectedEvent}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        onAttend={handleAttendEvent}
        onRate={handleRateEvent}
      />
    </div>
  );
}